exports.sendEmailTemp = async (OTP) => {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Open Sans", sans-serif;
      }
      header {
        width: 100%;
        color: white;
      }
      main {
        padding: 0 2rem;
      }
      footer {
        width: 100%;
        background: #f5f6fa;
        font-size: 16px;
        text-align: center;
        padding: 2rem 0;
      }
      p {
        font-size: 18px;
      }
      a {
        color: black;
      }
    </style>
  </head>
  <body>
    <header
      style="
        width: 100%;
        background: linear-gradient(180deg, #090e89 -30.09%, #030659 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
      "
    >
      <img
        src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673773465/Awasource/awasource_yxssbd.png"
        alt="Awasource"
        style="width: 160px; height: 28px"
      />
    </header>
    <main>
      <h1
        style="
          font-size: 24px;
          font-weight: 700;
          margin-top: 56px;
          margin-bottom: 24px;
        "
      >
        Hi,
      </h1>
      <p>
        Your Otp is ${OTP}
        <strong style="font-size: 24px; color: #04097b; padding-left: 10px"
          >343678</strong
        >
      </p>
      
      <p style="margin-top: 40px">Cheers, <br />Awasource team</p>
      <p style="margin-top: 64px; margin-bottom: 44px; text-align: center">
        Need help? Contact
        <a href="mailto:help@awasource.com" style="text-decoration: underline"
          >help@awasource.com</a
        >
      </p>
      <p
        style="
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
        "
      >
        Connect with us:
        <a
          href="https://awasource.com"
          target="_blank"
          rel="noreferrer"
          style="margin-left: 10px"
        >
          <img
            src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673789893/Awasource/website_b0g8pe.png"
            style="width: 28px; height: 28px"
            alt="website"
        /></a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noreferrer"
          style="margin: 0 10px"
        >
          <img
            src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673789909/Awasource/linkedin_i0dolo.png"
            style="width: 28px; height: 28px"
            alt="linkedin"
        /></a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          <img
            src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673789887/Awasource/instagram_agadhs.png"
            style="width: 28px; height: 28px"
            alt="instgram"
        /></a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          style="margin: 0 10px"
        >
          <img
            src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673790330/Awasource/facebook_voksck.png"
            style="width: 28px; height: 28px"
            alt="facebook"
        /></a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">
          <img
            src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673790330/Awasource/twitter_yumgds.png"
            style="width: 28px; height: 28px"
            alt="twitter"
        /></a>
      </p>
    </main>
    <footer>
      <p style="line-height: 28px">
        © All rights reserved by Anglitica
        <br />
        <span style="font-weight: 600">
          Awasource | Connecting Clients with Talents
        </span>
      </p>
    </footer>
  </body>
</html>
`;
  return html;
};

exports.forgotPasswordTemplate = async (firstName, URL, token) => {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Open Sans", sans-serif;
      }
      header {
        width: 100%;
        color: white;
      }
      main {
        padding: 0 2rem;
      }
      footer {
        width: 100%;
        background: #f5f6fa;
        font-size: 16px;
        text-align: center;
        padding: 2rem 0;
      }
      p {
        font-size: 18px;
      }
      a {
        color: black;
      }
    </style>
  </head>
  <body>
    <header
      style="
        width: 100%;
        background: linear-gradient(180deg, #090e89 -30.09%, #030659 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
      "
    >
      <img
        src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673773465/Awasource/awasource_yxssbd.png"
        alt="Awasource"
        style="width: 160px; height: 28px"
      />
    </header>
    <main>
      <h1
        style="
          font-size: 24px;
          font-weight: 700;
          margin-top: 56px;
          margin-bottom: 24px;
        "
      >
        Hi ${firstName},
      </h1>
      <p>
        <strong style="font-size: 18px"
          >Looks like you made a request to reset your password.</strong
        >
      </p>
      <p style="margin: 35px 0">
        <a
          href= "${URL}/auth/password/reset-password/${token}"
          target="_blank"
          rel="noreferrer"
          style="text-decoration: underline"
          >Click this link to proceed</a
        >
      </p>
      <p>
        If you didn't make this request, please reset your password to be safe
        or contact us on
        <a href="mailto:help@awasource.com" style="text-decoration: underline"
          >help@awasource.com</a
        >
        immediately.
      </p>
      <p style="margin-top: 40px">Cheers, <br />Awasource team</p>
      <p style="margin-top: 64px; margin-bottom: 44px; text-align: center">
        Need help? Contact
        <a href="mailto:help@awasource.com" style="text-decoration: underline"
          >help@awasource.com</a
        >
      </p>
      <p
        style="
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
        "
      >
        Connect with us:
        <a
          href="https://awasource.com"
          target="_blank"
          rel="noreferrer"
          style="margin-left: 10px"
        >
          <img
            src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673789893/Awasource/website_b0g8pe.png"
            style="width: 28px; height: 28px"
            alt="website"
        /></a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noreferrer"
          style="margin: 0 10px"
        >
          <img
            src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673789909/Awasource/linkedin_i0dolo.png"
            style="width: 28px; height: 28px"
            alt="linkedin"
        /></a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          <img
            src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673789887/Awasource/instagram_agadhs.png"
            style="width: 28px; height: 28px"
            alt="instgram"
        /></a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          style="margin: 0 10px"
        >
          <img
            src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673790330/Awasource/facebook_voksck.png"
            style="width: 28px; height: 28px"
            alt="facebook"
        /></a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">
          <img
            src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673790330/Awasource/twitter_yumgds.png"
            style="width: 28px; height: 28px"
            alt="twitter"
        /></a>
      </p>
    </main>
    <footer>
      <p style="line-height: 28px">
        © All rights reserved by Anglitica
        <br />
        <span style="font-weight: 600">
          Awasource | Connecting Clients with Talents
        </span>
      </p>
    </footer>
  </body>
</html>
`;
  return html;
};

exports.forgotPasswordTemplateClient = async (firstName, URL, token) => {
  const html = `<!DOCTYPE html>
  <html
    lang="en"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
  >                  
                          <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="x-apple-disable-message-reformatting" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>
        body {
          font-family: "Open Sans", sans-serif;
        }
        p,
        a {
          font-size: 18px;
        }
        main {
          padding:0 2rem;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0">
      <div style="background: #eab221">
      </div>
      <main>
        <h1 style="text-align: center; font-size: 25px;">Oops, seems you forgot your password</h1>
        <p>Hi ${firstName}.</p>
        <p> It seems you're having issues with your password, click on the button below to reset your password
        </p>
        <a
          href= "${URL}/auth/password/reset-password/${token}"
          style="
            display: block;
            text-align: center;
            width: 200px;
            margin: auto;
            background: #eab221;
            color: #ffffff;
            padding: 1rem;
            text-decoration: none;
          "
          >RESET PASSWORD</a
        >
        <p>
          Alternatively, you can copy and paste the link below in your browser.
          Link expires in 24 hours time.
        </p>
        <a href="${URL}/auth/password/reset-password/${token}" style="color: #390535; text-decoration: underline"
          >${URL}/auth/password/reset-password/${token}</a
        >
        <p>
          Please ignore this mail if you did not request for the reset of your password
        </p>
        <p>
          Cheers, <br />
          The Outsource Team
        </p>
      </main>
      <div style="background: #390535">
        <p style="color: #ffffff; text-align: center; padding: 2rem ">
          Need more help? <br />We are
          <a href="#3" style="color: #eab221">here</a>, ready to talk.
        </p>
      </div>
    </body>
    </html>
                          `;
  return html;
};

// reset password template for talent
exports.resetPasswordTemp = async (firstName) => {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Open Sans", sans-serif;
      }
      header {
        width: 100%;
        color: white;
      }
      main {
        padding: 0 2rem;
      }
      footer {
        width: 100%;
        background: #f5f6fa;
        font-size: 16px;
        text-align: center;
        padding: 2rem 0;
      }
      p {
        font-size: 18px;
      }
      a {
        color: black;
      }
    </style>
  </head>
  <body>
    <header
      style="
        width: 100%;
        background: linear-gradient(180deg, #090e89 -30.09%, #030659 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
      "
    >
      <img
        src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673773465/Awasource/awasource_yxssbd.png"
        alt="Awasource"
        style="width: 160px; height: 28px"
      />
    </header>
    <main>
      <h1
        style="
          font-size: 24px;
          font-weight: 700;
          margin-top: 56px;
          margin-bottom: 24px;
        "
      >
        Hi ${firstName},
      </h1>
      <p style="margin-bottom: 70px">Your password was successfully updated.</p>
      <p>
        If you didn't make this request, please reset your password to be safe
        or contact us on
        <a href="mailto:help@awasource.com" style="text-decoration: underline"
          >help@awasource.com</a
        >
        immediately.
      </p>
      <p style="margin-top: 40px">Cheers, <br />Awasource team</p>
      <p style="margin-top: 64px; margin-bottom: 44px; text-align: center">
        Need help? Contact
        <a href="mailto:help@awasource.com" style="text-decoration: underline"
          >help@awasource.com</a
        >
      </p>
      <p
        style="
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
        "
      >
        Connect with us:
        <a
          href="https://awasource.com"
          target="_blank"
          rel="noreferrer"
          style="margin-left: 10px"
        >
          <img
            src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673789893/Awasource/website_b0g8pe.png"
            style="width: 28px; height: 28px"
            alt="website"
        /></a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noreferrer"
          style="margin: 0 10px"
        >
          <img
            src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673789909/Awasource/linkedin_i0dolo.png"
            style="width: 28px; height: 28px"
            alt="linkedin"
        /></a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          <img
            src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673789887/Awasource/instagram_agadhs.png"
            style="width: 28px; height: 28px"
            alt="instgram"
        /></a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          style="margin: 0 10px"
        >
          <img
            src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673790330/Awasource/facebook_voksck.png"
            style="width: 28px; height: 28px"
            alt="facebook"
        /></a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">
          <img
            src="https://res.cloudinary.com/dzbmybcul/image/upload/v1673790330/Awasource/twitter_yumgds.png"
            style="width: 28px; height: 28px"
            alt="twitter"
        /></a>
      </p>
    </main>
    <footer>
      <p style="line-height: 28px">
        © All rights reserved by Anglitica
        <br />
        <span style="font-weight: 600">
          Awasource | Connecting Clients with Talents
        </span>
      </p>
    </footer>
  </body>
</html>
`;
  return html;
};
