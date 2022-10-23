const { Client } = require("discord.js");
/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  const express = require("express");
  const app = express();
  app.use(express.json());
  const session = require("express-session");
  const MongoStore = require("connect-mongo");
  const User = require("../data/mongo");
  const DiscordOauth2 = require("discordouth3");
  const oauth = new DiscordOauth2();
  const ejs = require("ejs");

  app.use(
    session({
      resave: false,
      secret: client.config.secret,
      saveUninitialized: false,
      cookie: { maxAge: 86400000 },
      store: MongoStore.create({
        mongoUrl: client.config.mongoUri,
      }),
    })
  );

    app.get('/', (req, res) => {
        res.redirect(client.config.redirect_url)
    })

  app.use((req, res, next) => {
    next();
  });

  const { Router } = require("express");
  app.set("view engine", "ejs");
  const router = Router();

  const CLIENT_ID = client.user.id,
    CLIENT_SECRET = client.config.secret,
    CLIENT_CALLBACK_URL = client.config.redirect_url;

  const passport = require("passport");
  const { Strategy } = require("passport-discord");

  passport.serializeUser((user, done) => done(null, user));

  passport.deserializeUser(async (userId, done) => {
    const user = await User.findOne({ userId:userId.userId });
    return done(null, user);
  });
  
  app.use(passport.initialize());
  app.use(passport.session());


passport.use(
    new Strategy(
      {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: CLIENT_CALLBACK_URL,
        scope: ['identify', 'guilds.join'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          oauth
            .addMember({
              guildId: client.config.serverID,
              botToken: client.token,
              userId: profile.id,
              accessToken,
            })
            .then(async () => {
              const guild = client.guilds.cache.get(client.config.serverID);
              const member = await guild.members.fetch(profile.id);
              const userData = {
                userId: profile.id,
                discordTag: `${profile.username}#${profile.discriminator}`,
                accessToken,
                refreshToken,
              };
              process.nextTick(() => done(null, userData));
              await User.findOneAndUpdate(
                {
                  userId: userData.userId,
                },
                userData,
                {
                  upsert: true,
                }
              );
            });
        } catch (e) {
          process.nextTick(() => done(e));
        }
      }
    )
  );

  router.get(
    "/",
    passport.authenticate("discord"),
    (req, res) => {
      req.session.user = req.user;
      ejs.renderFile(
      "html.ejs",
{ userName: req.user.discordTag },
function (err, str) {
if (err) return res.status(404);
res.send("str");
}
);
      res.render("./html.ejs", 
          { userName: req.user.discordTag }
      )
    }
  );

  router.get("/", async (req, res) => {
    req.user = req.session.user;
    if (!req.user) return res.sendStatus(401);
    console.log(req.user)

    res.send({
      userId: req.user.userId,
      discordTag: req.user.discordTag,
    });
  });
  router.get("/logout", function (req, res) {
    req.session.destroy(() => {
      req.logout();
      res.status(200);
    });
  });

  const authenticationRouter = router;
  app.use("/login", authenticationRouter);

  app.all("/:param?", (req, res) => {
    res.send({
      query: req.query,
      params: req.params,
      body: req.body,
    });
  });

  app.use((req, res, next) => {
    res
      .status(404)
      .send(app._router.stack.filter((r) => r.route).map((r) => r.route.path));
  });

  const PORT = 5555;
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
};