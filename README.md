# Exordium (Rest API)

The Exordium API is used for https://exordium.org/ and https://clients.exordium.org/ and the respective desktop and mobile apps as well. 
## Prelude

Exordium is a virtual private networking software in the works. **Our goal is to donate all profits made from the VPN towards environmental protection, and to fight against the climate crisis.**

We hope to share as much of our programming as open source code to help others create their own projects and further the development of software built with `electronjs` and `nodejs`, which are the fundamental pieces to us.

## API Progress

Currently the API is designed using nodejs and expressjs, however we are currently planning on translating the project into typescript so it matches with our file formats for our other projects.

At the current moment our `js` api has the following progress completed;
- [x] `/public` - for general public requests
  - [x] `/contact` - allows general public to send us contact requests
  - [ ] `/blog` - allows general public to access our blog posts
  - [ ] `/servers` - allows general public to access our servers directory
- [x] `/auth` - allows clients to authenticate themselves
  - [x] `/register` - allows client to register their account with us
  - [x] `/signin` - allows client to sign into their account
  - [ ] `/forgotten-pass` - allows a user to reset their password
  - [ ] `/unlock` - if a user gets logged out of their account for idling, this would regrant them access.
- [x] `/user/me` - access your own accounts data
  - [x] `/basic` - basic account info
  - [x] `/advanced` - advanced account info
  - [ ] `/tokens` - users current session tokens
  - [ ] `/connections` - allows 3rd party connections
    - [x] `/discord` - discord connection
    - [ ] `/github` - github connection
- [ ] `/management` - service management section
  - [x] `/contact` - shows all contact requests received
  - [ ] `/watchdog` - returns back current site activity for the last (x) time.
  - [x] `/users` - user management (shows all users)
    - [ ] `:id` - shows specific user data
  - [ ] `/servers` - server management (shows all servers)
    - [ ] `/:id` - shows specific server data
  - [ ] `/blogs` - blog management (shows all blog posts)
    - [ ] `/:id` - shows specific blog data
  - [ ] `/devblog` - dev blog management (shows all dev blog posts)
    - [ ] `/:id` - shows specific dev blog 

## Issues/Suggestions

If you run into an issues regarding the application, feel free to open [an issue](https://github.com/exordium-dev/exordium-api/issues) so we can work together and resolve it. You can also contact us through our [discord server](https://discord.exordium.dev/), or [emails](mailto:contact@exordium.dev).

## Contact Us

If you need to get in contact with our development team or customer support, please either [join our discord server](https://discord.exordium.dev) or visit [our contact page on our website](https://exordium.dev/contact).

If you want to send us an email, regarding any issue, you can send an email to:
- :envelope: [contact@exordium.dev](mailto:contact@exordium.dev)
- :envelope: [exordium.dev@protonmail.com](mailto:exordium.dev@protonmail.com)

## Contributors

The following contributors have either helped to start this project, contributed code, or are actively maintaining it (including documentation, and creating issues), or are in some other way being awesome contributors to this project and we would like to take a moment to recognize them.

[<img src="https://github.com/BradOnDex.png?size=72" alt="BradOnDex" width="72">](https://github.com/BradOnDex)

The Exordium development team:

[<img src="https://github.com/FearGannicus.png?size=72" alt="FearGannicus" width="72">](https://github.com/FearGannicus)
[<img src="https://github.com/InvalidEm.png?size=72" alt="InvalidEm" width="72">](https://github.com/InvalidEm)
[<img src="https://github.com/shuZro.png?size=72" alt="shuZro" width="72">](https://github.com/shuZro)
