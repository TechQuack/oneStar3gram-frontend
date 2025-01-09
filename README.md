
# OneStar3gram-frontend

## Introduction

Ce dépot contient la partie front-end de l'application OneStar3gram réalisée avec le framework Angular.

## Installation du dépot

Pour pouvoir utiliser localement ce dépot, la première étape est de le télacharger via l'archive au format zip depuis le haut de la page de ce dernier ou bien en le clonant via une de ces deux méthodes:

### HTTPS

`git clone https://github.com/TechQuack/oneStar3gram-frontend.git`

### SSH

`git clone git@github.com:TechQuack/oneStar3gram-frontend.git`

## Lancement du projet

Pour lancer le projet, il faut suivre les étapes suivantes:

1. S'assurer que le démon docker est lancé, cela peut se faire avec l'application de bureau ou la commande suivante:  
`sudo systemctl start docker`  
2. Pour le bon fonctionnement du projet, il est necessaire d'avoir les dépots Keycloak et back-end de lancés sur la même machine avant de lancer ce dépot (accessibles respectivement via ces liens https://github.com/TechQuack/oneStar3gram-keycloak, https://github.com/TechQuack/oneStar3gram-backend)
3. Lancer le dépot en lui même via cette commande (en étant dans le dossier du projet `cd oneStar3gram-frontend`)  
`docker compose up --build`

## Accès à l'application

### Point de vue d'un utilisateur

L'accès à l'application pour un utilisateur classique se fait se fait via l'url suivante: https://proxy-onestar3gram/

### Point de vue d'un administrateur

L'utilisation du site se fera avec la même adresse, à l'exception que le premier compte administateur doit avoir son son rang ajouté depuis l'interface d'administration Keycloak accessible via ce lien https://proxy-onestar3gram:8080/
