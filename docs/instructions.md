# Maïa

Félicitations ! 

Vous voici en possession d’une lampe très spéciale, baptisée Maïa ! C’est peut-être un peu intimidant et vous ne savez pas par où commencer ? Rassurez-vous, cette page d'instructions est là pour vous aider :) 

*Note : les captures d'écran montrent alternativement la version pour ordinateur et pour téléphone de l'interface. Mais l'ensemble des fonctionalités est disponible sur les deux plateformes !*


## Sommaire 

1. [Je suis Maïa] (#maia)
	1. [Les composants] (#composants)
	2. [Focus sur le bouton] (#bouton)
	3. [Focus sur l'horloge RTC] (#RTC)
	4. [Déconnecter la lampe] (#déconnecter)
	
2. [Pour bien commencer] (#start)
3. [Découverte de l'application] (#app-discover)
4. [Les fonctionalités] (#features)
	1. [À propos] (#about)
	2. [Modes] (#modes)
	3. [Couleurs] (#couleurs)
	4. [Mesures] (#mesures)
	5. [Règles] (#rules)
5. [Source et contact] (#contact)

<br />
<br />
___
<br />


# Je suis Maïa <a name="maia"></a>


Maïa est une lampe d'ambiance. C'est-à-dire que vous pouvez l'installer où vous voulez pour créer une ambiance lumineuse ! A priori, elle ne remplace pas une lampe d'éclairage, sauf si vous souhaitez une faible luminosité.

Un certain nombre de modes lumineux sont déjà configurés sur la lampe, mais vous êtes libres de créer les ambiances que vous voulez avec ! 

### Les composants <a name="composants"></a>

Petite présentation des différents composants de la lampe :

- le socle : il constitue la base de la lampe, et contient un certain nombre de composants à lui tout seul ! 
	- une prise USB pour alimenter la lampe (l'alimentation est fournie avec la lampe)
	- un bouton de commande externe
	- un capteur de luminosité
	- un capteur de température, humidit et pression de l'air
	- une horloge
	- et le microcontrôleur, qui est le cerveau de l'opération !

- la spère de LED est composée de 29 LED

- le diffuseur, que vous pouvez remplacer par tout ce que vous voulez ! Nous sommes partis sur une sphère, mais peut-être que vous préférez une forme différente, une matière différente, vous faites comme vous voulez !


### Focus sur le bouton <a name="bouton"></a>

Le bouton vous permet de commander de manière basique la lampe, sans avoir besoin d'utiliser l'application. 

Pour allumer ou éteindre la lampe, presser une fois le bouton.
Si vous maintenez le bouton appuyé, la lampe va passer d'un mode à l'autre, relâcher le bouton quand vous avez atteint le mode lumineux que vous préférez !
 

### Focus sur l'horloge RTC <a name="RTC"></a>

Comme vous le verrez plus loin, il vous est possible de configurer la lampe pour s'allumer ou s'éteindre automatiquement. Et pour ça, la lampe a besoin de savoir quelle heure il est à tout instant ! C'est à ça que sert l'horloge.

Cette horloge fonctionne avec une pile , qui est accesible sous la lampe. 
Pour la remplacer, presser les bagues qui maintiennent la pile pour la retirer, et insérer une nouvelle pile à la place en exerçant une pression légère


### Déconnecter la lampe <a name="déconnecter"></a>

La lampe fonctionnera tout le temps tant qu’elle est alimentée. Elle consomme très (très) peu d'énergie, rassurez-vous !

Pour la déconnecter complètement, débranchez-la. 

<br />
<br />
___
<br />


# Pour bien commencer...<a name="start"></a>


La lampe peut fonctionner de manière autonome, mais nous vous recommandons pour une première utilisation de visiter l'interface utilisateur qui a été créée spécialement pour piloter la lampe !

Pour cela, vous devez vous munir de l'un des appareils suivants :

- d'un ordinateur avec une connexion bluetooth possible
- d'un téléphone portable Android (> version 6)

Et vérifier que :

- vous pouvez ouvrir Chrome
- vous avez activé le bluetooth

Il n'y a pas de support pour iOS pour l'instant, mais ça ne saurait tarder ! 

<br />
<br />
___
<br />


# Découverte de l'application <a name="app-discover"></a>


Vous pouvez accéder à l'application en cliquant [ici] (https://maia.acoullandreau.com).

Si vous utilisez cette application depuis votre téléphone, nous vous recommandons de l'ajouter à l'écran d'accueil ! 
À la première ouverture de l'application, un bandeau apparaît et vous propose d'ajouter Maïa à l'écran d'accueil. 

Si ce bandeau n'apparaît pas, suivez les étapes suivantes :

1. Cliquer sur le menu de Chrome (les trois points en haut à droite)
2. Un menu déroulant s'affiche, cliquer que "Ajouter à l'écran d'accueil)


Vous voilà prêts à vous connecter à la lampe !

Pour cela, cliquer sur Connexion, et sélectionnez "Maïa" sur la fenêtre qui s'affiche.

![Home](./docs-img/mobile/home.png?raw=true "Home")
![Pair device](./docs-img/desktop/pair.png?raw=true "Pair device")

La connexion peut prendre quelques secondes. Si au bout de 30 secondes rien ne se passe, rafraîchissez la page et recommencez l'opération.

L'application fonctionne hors ligne, mais nous vous recommandons de temps en temps de l'ouvrir avec une connexion internet active pour profiter d'éventuelles mises à jour de l'interface !

<br />
<br />
___
<br />


# Les fonctionalités <a name="features"></a>


### Le menu "À propos" <a name="about"></a>

Vous aurez toujours accès à cette page en passant par le menu À propos de l'application ! Cliquez sur le (i) pour ouvrir ce menu !

![About](./docs-img/mobile/about.png?raw=true "About")


### Le menu "Modes" <a name="modes"></a>

C'est à partir de ce mode que vous pourrez sélectionner un mode pour la lampe, ou encore personaliser les couleurs, la vitesse des animations. 

Le menu est divisé en deux catégories :

- les modes interactifs, qui sont préconfigurés sur la lampe.
- les modes que vous avez vous-même enregistrés !


À tout instant vous pouvez voir quel est le mode actif grâce à la bordure autour de la tuile. 


##### Les modes interactifs

Ces modes sont préconfigurés sur la lampe. 

![Modes Default](./docs-img/mobile/modes-default.png?raw=true "Modes menu - Preconfigured")

Aucun de ces modes ne peut être supprimé. Bien que certains modes ne puissent pas être édités, vous avez la possibilité pour certains modes de changer les couleurs de la palette. Vous ne pourrez cependant modifier ni la vitesse d'animation ni le nom du mode. 

##### Les modes personalisés

Vous pouvez créer autant de modes que vous le souhaitez ! 

![Modes custom](./docs-img/mobile/modes-custom.png?raw=true "Modes menu - user-defined")


Plus de détails sur comment définir un nouveau mode [ici] (#couleurs).


##### Éditer un mode <a name="edit"></a>

Sur ordinateur, passez la souris au-dessus d'une tuile. Si le mode peut être édité un crayon apparaît à côté du nom du mode.

![Modes Custom](./docs-img/desktop/modes-custom-hover.png?raw=true "Edit custom mode")


Sur téléphone ou tablette, maintenez votre doigt appuyé sur la tuile pour faire apparaître un menu.

![Menu default mode](./docs-img/mobile/modes-default-hold-touch.png?raw=true "Menu default mode") ![Menu custom mode](./docs-img/mobile/modes-custom-hold-touch.png?raw=true "Menu custom mode")


Une fois que vous avez sélectionné "éditer", une fenêtre s'ouvre avec la configuration actuelle du mode.

![Custom edit](./docs-img/mobile/modes-custom-edit.png?raw=true "Custom edit")

Dans le cas des modes préconfigurés, vous aurez toujours la possibilité de réinitialiser la configuration d'origine en cliquant sur "Reset".

![Default edit](./docs-img/desktop/modes-default-edit.png?raw=true "Default edit")
![Default edit](./docs-img/mobile/modes-default-edit.png?raw=true "Default edit")


Si vous ne cliquez pas sur "Enregistrer" avant de quitter la fenêtre, un message de confirmation s'affichera pour vous permettre de quitter sans sauvegarder les changements.

![Discard changes](./docs-img/mobile/discard-changes.png?raw=true "Discard changes")


##### Supprimer un mode

Uniquement les modes que vous avez définis peuvent être supprimés. Le bouton supprimé est visible en passant la souris sur une tuile depuis un ordinateur, ou en maintenant le doigt appuyé sur la tuile sur téléphone portable (cf. [Éditer un mode] (#edit)).

Un message de confirmation s'affiche, mais attention, l'action est irréversible !

![Delete mode](./docs-img/mobile/mode-delete.png?raw=true "Delete mode")


### Le menu "Couleurs" <a name="couleurs"></a>

Vous accédez à ce menu soit depuis la barre de navigation, soit depuis l'onglet "Personalisés" du menu "Modes", en cliquant sur le + !

Ce menu vous permet de définir un nouveau mode, que vous le sauvegardiez ou non. Vous pouvez visualiser en direct la configuration de ce nouveau mode. 

![Colors](./docs-img/mobile/colors.png?raw=true "Colors")


Vous avez la possibilité de choisir jusqu'à 10 couleurs, d'ajuster la vitesse d'animation, et de nommer le mode comme vous le voulez.
L'animation est par défaut un gradient qui passe aléatoirement d'une couleur à l'autre, dont vous pouvez ajuster la vitesse de transition.

![Modes max colors](./docs-img/desktop/colors-max-select.png?raw=true "Modes max colors")

Pour enregistrer le mode, cliquer sur "Enregistrer mode". Vous pouvez nommer le mode comme vous le souhaitez.

![Save a mode](./docs-img/desktop/save-mode.png?raw=true "Save a mode")

Il apparaît ensuite en tête de liste !

![Saved modes list](./docs-img/desktop/save-mode-list.png?raw=true "Saved modes list")


### Le menu "Mesures" <a name="mesures"></a>

Ce menu vous montre ce que mesure le capteurs météo. Actuellement vous avez accès à la température, le taux d'humidité et la pression atmosphérique. Les valeurs sont mises à jour automatiquement toutes les 100ms !

![Readings](./docs-img/desktop/readings.png?raw=true "Readings menu")


### Le menu "Règles" <a name="rules"></a>

C'est à partir de ce menu que vous pouvez configurer toutes les règles d'automatisation de la lampe !

![Rules](./docs-img/desktop/rules.png?raw=true "Rules menu")


Voici l'ensemble des règles que vous pouvez configurer :

**"Laisser la lampe choisir automatiquement le mode actif"**

La lampe choisit automatiquement le mode en fonction du moment. Par exemple, s'il est 21h, un mode relaxant ou romantique. Si on est le 25 décembre, le mode "Joyeux Noël",.....


**"Désactiver les automatismes si aucun son pendant plus de X heures"**

La lampe va automatiquement désactiver les règles d'allumage et d'extinction automatique si aucun son n'est détecté pendant X heures. Cette fonctionalité peut être pratique si vous partez en vacances par exemple !

**"Allumage automatique / Extinction automatique"**

Ces deux fonctions sont construites de la mpeme manière, l'une pour contrôller l'allumage automatique, et l'autre l'extinction. Pour chacune d'entre elle, vous avez deux options : 

- baser l'allumage/l'extinction sur le niveau lumineux détecté ; vous avez la possibilité de définir un horaire avant lequel la lampe n'exécutera pas cette commande même si le niveau est trop haut/bas. Par exemple, s'il fait très sombre à 16h à cause d'un orage mais que vous avez configuré l'heure minimale d'allumage à 18h, la lampe ne s'allumera pas
- baser l'allumage/l'extinction sur une heure fixe ; vous avez la possibilité de définir un horaire de gradation, à partir duquel la lampe va soit commencer à s'allumer ou à s'éteindre progressivement
		

Tous les changements que vous effectuez depuis ce menu sont sauvegardés automatiquement sur la lampe.

<br />
<br />
___
<br />


# Source et contact <a name="contact"></a>

Vous rencontrez d'autres problèmes ou souhaitez nous faire part d'améliorations possibles ? N’hésitez pas à nous contacter : \_maia_@acoullandreau.com !

Si vous avez reçu cette lampe en cadeau de la part d'Alexina et Gustavo, elle est garantie à vie ! :) 

Si par hasard vous avez envie de découvrir l'envers du décor, rendez-vous sur le répositoire du [code source de la lampe] (https://github.com/acoullandreau/mood_lamp) !
