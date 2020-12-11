Note:la version en français de ce document est disponible [ici](XXXXXXX) !


# Maïa, the application


Welcome!
This repository contains all the code we put together to build the application that allows you to control a Maïa mood lamp! Maïa is a lamp that can be assembled with very few (and cheap) components, 3D printed parts, and controlled remotely from your phone or computer using bluetooth!

If you already have a lamp, get the app [here](XXXXXXX) now! 
If you wish to build your own lamp, check out the other sections of [this repository] (XXXX).


Structure of the app
------------------------

This app is built using React in association with Redux. It is a Progressive Web App (PWA). 
It therefore has a desktop version (minimal screen size targeted of 1024 x 768), and a mobile version (minimal screen size targeted 360 x 640).

Because it relies on web bluetooth to communicate with the lamp, the app only runs on Chrome for Android and desktop (no other browser supports web bluetooth, and CHrome for iOS neither).

The following graph shows how the app is structured showing its main components. If you want to be able to look at it bigger, it is available [here](XXXXXXX).


![Structure](StructureGraph.png?raw=true "App structure")


The app relies on a few dependencies:
- iro color picker (^5.2.3)
- react-tabs (^3.1.1)
- react-spinners-css (^1.2.2)
- react-time-picker (^4.0.1)
- react-redux (^7.2.2)
- (redux-thunk (^2.3.0) not currently used - no middleware)


Features
------------------------

The application is composed of four menus. 

Modes


Colors


Readings



Rules




For now the Home is used only to display the "Connect" button upon launching the app, and prior to being connected to a lamp. In the future it will probably be used to add the OTA UI elements, and will be accessible by clicking on the Maia logo.


Further work and contact
----------------------------

Here are some of the improvements that we are thinking about:

- support other languages on the application (currently only available in French)
- add support for OTA
- add options for rules
	- possibility to enable automatic turn on based on a noise (some ML to implement)
	- handle user inputs with warnings when the values are not good
	- hours as well as minutes for the time before turning off the automatisms if no noise heard
- implement an iOS application (web bluetooth supported only on Chrome for desktop and Android)

Also, don't hesitate to get in touch with us, if you liked this project, if you would like to suggest improvements or contribute!
We are [Alexina Coullandreau](https://www.acoullandreau.com) and [Gustavo Buzogany Eboli](https://www.gbuzogany.com)
