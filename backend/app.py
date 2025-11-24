from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql

app = Flask(__name__)
CORS(app)

# DB 설정 (비밀번호 꼭 확인하세요!)
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root', # 👈 비밀번호 확인!
    'db': 'subscription_service',
    'charset': 'utf8',
    'cursorclass': pymysql.cursors.DictCursor
}

def get_db_connection():
    return pymysql.connect(**db_config)

# [NEW] 회원가입 API
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    nickname = data.get('nickname')

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # 1. 이미 있는 이메일인지 확인
            cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
            if cursor.fetchone():
                return jsonify({"result": "fail", "message": "이미 가입된 이메일입니다."}), 400

            # 2. 유저 생성
            sql_user = "INSERT INTO Users (email, password, nickname) VALUES (%s, %s, %s)"
            cursor.execute(sql_user, (email, password, nickname))
            new_user_id = cursor.lastrowid # 방금 생긴 유저 ID 가져오기

            # 3. [센스] 기본 결제 수단 하나 자동 생성 (그래야 바로 구독 등록 가능)
            sql_card = "INSERT INTO PaymentMethods (user_id, method_name) VALUES (%s, %s)"
            cursor.execute(sql_card, (new_user_id, '내 기본 카드'))
            
            conn.commit()
            return jsonify({"result": "success"}), 201
    finally:
        conn.close()

# [NEW] 0. 로그인 API
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # 이메일과 비밀번호가 일치하는 유저 찾기
            sql = "SELECT user_id, nickname FROM Users WHERE email = %s AND password = %s"
            cursor.execute(sql, (email, password))
            user = cursor.fetchone()
            
            if user:
                return jsonify({"result": "success", "user": user}), 200
            else:
                return jsonify({"result": "fail", "message": "이메일 또는 비밀번호가 틀렸습니다."}), 401
    finally:
        conn.close()

# 1. 구독 목록 조회 (유저 ID를 받아서 처리하도록 수정됨)
@app.route('/subscriptions', methods=['GET'])
def get_subscriptions():
    # 프론트엔드에서 보내준 user_id를 받습니다.
    user_id = request.args.get('user_id')
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                SELECT 
                    sub.subscription_id,
                    s.service_name,
                    s.logo_url,
                    p.plan_name,
                    pm.method_name,
                    sub.billing_day,
                    sub.real_price,
                    sub.memo
                FROM Subscriptions sub
                JOIN Plans p ON sub.plan_id = p.plan_id
                JOIN Services s ON p.service_id = s.service_id
                JOIN PaymentMethods pm ON sub.method_id = pm.method_id
                WHERE sub.user_id = %s  -- 👈 여기를 동적으로 변경!
                ORDER BY sub.billing_day ASC
            """
            cursor.execute(sql, (user_id,))
            result = cursor.fetchall()
            return jsonify(result)
    finally:
        conn.close()

# 2. 구독 추가 (등록할 때 유저 ID 포함)
@app.route('/subscriptions', methods=['POST'])
def add_subscription():
    data = request.json
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO Subscriptions (user_id, plan_id, method_id, billing_day, real_price, memo)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                data['user_id'], # 👈 프론트엔드에서 받은 ID 사용
                data['plan_id'], 
                data['method_id'], 
                data['billing_day'], 
                data['real_price'], 
                data.get('memo', '')
            ))
            conn.commit()
            return jsonify({"message": "success"}), 201
    finally:
        conn.close()

# 3. 옵션 목록 조회 (유저별 카드 목록)
@app.route('/options', methods=['GET'])
def get_options():
    user_id = request.args.get('user_id') # 👈 여기도 유저 ID 받기
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Services")
            services = cursor.fetchall()
            
            cursor.execute("SELECT * FROM Plans")
            plans = cursor.fetchall()
            
            # 해당 유저의 카드만 가져오기
            cursor.execute("SELECT * FROM PaymentMethods WHERE user_id = %s", (user_id,))
            methods = cursor.fetchall()
            
            return jsonify({
                "services": services,
                "plans": plans,
                "methods": methods
            })
    finally:
        conn.close()

# 4. 구독 삭제
@app.route('/subscriptions/<int:sub_id>', methods=['DELETE'])
def delete_subscription(sub_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM Subscriptions WHERE subscription_id = %s", (sub_id,))
            conn.commit()
            return jsonify({"message": "deleted"}), 200
    finally:
        conn.close()

# [NEW] 5. 결제 수단 관리 (조회, 추가, 삭제)

# 5-1. 내 결제 수단 목록 조회
@app.route('/payment-methods', methods=['GET'])
def get_payment_methods():
    user_id = request.args.get('user_id')
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM PaymentMethods WHERE user_id = %s"
            cursor.execute(sql, (user_id,))
            result = cursor.fetchall()
            return jsonify(result)
    finally:
        conn.close()

# 5-2. 결제 수단 추가
@app.route('/payment-methods', methods=['POST'])
def add_payment_method():
    data = request.json
    user_id = data.get('user_id')
    method_name = data.get('method_name')
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            sql = "INSERT INTO PaymentMethods (user_id, method_name) VALUES (%s, %s)"
            cursor.execute(sql, (user_id, method_name))
            conn.commit()
            return jsonify({"result": "success"}), 201
    finally:
        conn.close()

# 5-3. 결제 수단 삭제
@app.route('/payment-methods/<int:method_id>', methods=['DELETE'])
def delete_payment_method(method_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            # 혹시 이 카드를 사용 중인 구독이 있는지 먼저 확인? (여기선 생략하고 강제 삭제 시도)
            # 외래키 제약조건 때문에 사용 중인 카드는 삭제 안 될 수 있음 -> 에러 처리 필요
            try:
                cursor.execute("DELETE FROM PaymentMethods WHERE method_id = %s", (method_id,))
                conn.commit()
                return jsonify({"result": "success"}), 200
            except pymysql.err.IntegrityError:
                return jsonify({"result": "fail", "message": "사용 중인 카드는 삭제할 수 없습니다."}), 400
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)