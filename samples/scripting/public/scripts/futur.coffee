logger.log "COFFEE start"
w1 = []
w1.push "Oui apparemment."
w1.push "Pour la plupart oui. Vous obtenez ce que vous voulez mais les choses ne sont pas tout à fait comme elles paraissent."
w1.push "Prendre le temps, laisser venir, un contretemps peut se révéler être malgré les apparences un bien. Si on ne le fait pas, de soi-même, il faut laisser les éléments se mettre en place. Quand le bon moment sera venu, vous le saurez. C'est toujours le premier pas le plus difficile à accomplir"
w1.push "Pas tout de suite."
w1.push "Ayez confiance."
w1.push "Un peu de patience, tout va évoluer."
w1.push "N'attendez rien de cette situation, une autre solution va se présenter."
w1.push "Tout est noir je ne peux pas voir votre avenir."
w1.push "Le destin est deja tout trace."
w1.push "Tout est negatif, il m'est impossible de percevoir une once d'onde positif"
w1.push "Il n'y a pas de reponse tout est entre vos mains."

t = new MSG()
t.msgdata = w1.rnd
t.sendSMS()
logger.log "COFFEE END"
