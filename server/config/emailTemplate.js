export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Login Code</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
        body {
            background-color: #f4f4f4;
            font-family: 'Outfit', sans-serif;
        }
        .container {
            max-width: 400px;
            background-color: #ffffff;
            margin: 0px auto;
            padding: 10px;
            text-align: center;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        .otp-container {
            margin: 20px 0;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 7px;
            padding: 10px 15px;
            display: inline-block;
        }
        .info {
            color: #333;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .email {
            color: #167af6;
            text-decoration: none;
            font-weight: bold;
        }
        .footer {
            font-size: 12px;
            color: #999;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="logo">auth</h1>
        <h2>Email Verification Code</h2>
        <p class="info">Use this code to verify your account.<br>This code will expire in 24 hours.</p>
        <div class="otp-container">
            <span class="otp" id="otp">{{otp}}</span>
        </div>
        <p class="info">This code is associated with your email <br><span class="email">{{email}}</span></p>
        <p class="footer">If you didn’t request this email, you can safely ignore it.</p>
    </div>
</body>
</html>

`

export const PASSWORD_RESET_TEMPLATE =  `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Login Code</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
        body {
            background-color: #f4f4f4;
            font-family: 'Outfit', sans-serif;
        }
        .container {
            max-width: 400px;
            background-color: #ffffff;
            margin: 0 auto;
            padding: 10px;
            text-align: center;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        .otp-container {
            margin: 20px 0;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 7px;
            display: inline-block;
        }
        .info {
            color: #333;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .email {
            color: #167af6;
            text-decoration: none;
            font-weight: bold;
        }
        .footer {
            font-size: 12px;
            color: #999;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="logo">auth</h1>
        <h2>Password Reset Code</h2>
        <p class="info">Use this code to reset your password.<br>This code will expire in 10 minute.</p>
        <div class="otp-container">
            <span class="otp" id="otp">{{otp}}</span>
        </div>
        <p class="info">This code is associated with your email <br><span class="email">{{email}}</span></p>
        <p class="footer">If you didn’t request this email, you can safely ignore it.</p>
    </div>
</body>
</html>

`