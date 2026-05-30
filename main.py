try:
    from flask import Flask, request, jsonify
    from flask_cors import CORS
except ImportError as e:
    raise ImportError(
        'Missing Flask dependencies. Install them with: pip install flask flask-cors'
    ) from e

from predictor import detect_fraud

app = Flask(__name__)
CORS(app)

@app.route('/check_fraud', methods=['POST'])
def check_fraud():

    try:
        data = request.get_json()

        amount = int(data.get('amount', 0))
        merchant = data.get('merchant', 'Known')
        device = data.get('device', 'Old')
        time = data.get('time', 'Day')

        result = detect_fraud(amount, merchant, device, time)

        return jsonify(result)

    except Exception as e:
        return jsonify({
            'error': str(e)
             }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)