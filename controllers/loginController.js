exports.login = function (req, res) {
  if (!req.recaptcha.error) {
    // reCAPTCHA passed, proceed with login logic
    const { email, password } = req.body;
    res.render("index", { title: email });
  } else {
    // reCAPTCHA failed, handle the error
    console.log(req)
    res.redirect(`/login?usuario=${req.body.email}`);
  }
};
