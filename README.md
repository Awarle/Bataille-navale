# Projet: 
Il s'agit d'un jeu à 2 joueurs dans lequel vous placez des bateaux dans une matrice et jouerez chacun son tour.
Il s'agit d'une matrice de 8 de longueur et 8 de largeur.
Chaque tour, les joueurs choisissent une position à attaquer et si un bateau s'y trouve, cette position sera marquée par un X.

Le premier joueur qui a détruit tous les bateaux de l'autre joueur, gagne.

# Mode simplifié:
Dans ce mode, tous les bateaux ont une taille de 1 par 1 (longueur et largeur) et sont positionnés aléatoirement.

Votre programme doit se lancer de cette façon:

$ tsc main.ts
$ node main.js --mode simple --number <n>
Où <n> est le nombre de bateaux générés pour chaque joueur.

# Instructions de jeu:
Afin de vous aider, voici des indices sur comment organiser votre projet:

Générez une matrice
Utilisez une boucle pour le jeu
Place les bateaux sur votre matrice
Démarrez le jeu:
Joueur 1 joue, la matrice s'affiche avec le champ de bataille actualisé. Il tire et finit son tour.
Joueur 2 joue, tout se déroule de la même façon.
Vérifiez à chaque action si tous les bateaux d'un joueur ont coulé. Si c'est le cas, l'autre joueur a gagné
Vous êtes libres sur la façon d'exécuter des actions.

# Mode Normal:
Cette fois, on se situe dans un cas classique où les deux joueurs choisissent les emplacements des bateaux. Ces derniers sont dorénavant plus long et nécessitent donc d'être touchés plusieurs fois.

Votre programme doit se lancer de la façon qui suit:

$ tsc main.ts
$ node main.js --mode normal --data <json_file>
<json_file> étant le chemin d'accès à un fichier en JSON où sont stockées les données des différents types de bateaux pouvant être placés

# Contenu JSON:
Vous pouvez vous baser sur le fichier déjà fournis, celui-ci contient plusieurs informations pour vos bateaux.
Ce qui nous intéressera pour le Mode Normal, c'est le nom et la taille du bateau ainsi que le nombre à placer.
Les autres informations sont destinées au prochain mode.

# Instructions de jeu:
Tout en reprenant les instructions précédentes, pensez bien au fait que cette fois, ce sont les joueurs qui choisissent des emplacements de leurs bateaux.

Vous avez libre-arbitre sur comment cela est géré par la joueurs.

# Attention !:
Étant donné que les bateaux ont des tailles différentes, faites bien attention à ce que ceux-ci ne se rentrent pas dedans !
Deux bateaux ne peuvent être sur les mêmes cases.

# Mode Avancé:
Vous pouvez ajouter divers bonus à votre programme, sans que cette liste ne soit exhaustive:

Utiliser les données supplémentaires du fichier JSON donné
Une matrice à taille variable
Les bateaux peuvent se déplacer entre chaque tour
Créer une IA capable de jouer à la place d'un joueur, et même avoir des combats entre IA
Utilisation de couleurs
Actualisation de l'écran entre les tours
Lancer le programme sans arguments et configurable à travers un menu avant la partie
