exports.productLaunchTemp = async () => {
  const html = `
    <!DOCTYPE html>
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
        max-width: 600px;
        margin: auto;
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
        Hi there,
      </h1>
      <p>
        Thanks for signing up! You will be one of the first to be notified to
        try our product on a free-mium plan.
      </p>
      <p style="margin-top: 40px">Cheers, <br />Awasource team</p>
      <p
        style="
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 80px;
          margin-bottom: 30px;
          flex-wrap: wrap;
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
