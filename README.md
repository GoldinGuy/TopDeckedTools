# TopDeckedTools

  <a href="https://github.com/GoldinGuy/TopDeckedTools/graphs/contributors" alt="Contributors">
        <img src="https://img.shields.io/github/contributors/GoldinGuy/TopDeckedTools" /></a>
 <a href="https://img.shields.io/badge/Built%20With-Ionic%205-blue">
        <img src="https://img.shields.io/badge/Built%20With-Ionic%205-blue" alt="ionic5"></a>

:wrench: An Ionic app that contains several tools, features, and/or utilities used in TopDecked, an essential all-in-one companion app & website for MTG deck-building, 3D simulation testing, pricing, trading, and collecting.
This repository includes a full `rules search engine and term glossary`, a swiss-style `tournament system` with smart pairings, and a heavily customizable `life tracker` with round timer, history, and more!

This project is part of an Internship with [@LincolnThree](https://github.com/lincolnthree), where we have been working to create new and exciting functionality for TopDecked.
Lincoln is an amazing mentor, and I am incredibly grateful to have the opportunity to work on this with him.

The code is fairly straightforward - each feature has its own tab/page, and is split into two parts: a `.service.ts` file that contains the core functionality and relevant interfaces, and a page folder with `.html`, `css`, and one or more `.ts` files containing UI-based code.

You can view these features and use them in TopDecked on the [site](https://www.topdecked.com/) or [app](https://app.topdecked.me/)

You can also download and run this code with the following commands
(ensure you have ionic and angular installed, as well as all the necessary packages)

```
npm install
```

```
ionic serve
```

The base of some of the code in this project was originally written for [Mystic](https://play.google.com/store/apps/details?id=com.goldin.mystic&hl=en_US), an app @TimG and I worked on in the summer of 2019 that aimed to do many of the same things as TopDecked
