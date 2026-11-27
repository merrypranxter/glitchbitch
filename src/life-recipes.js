export const lifeGroups={"network":["lifeNetwork","lifeNetworkMode","lifeNetworkReach","lifeNetworkWidth"],"alchemy":["lifeAlchemy","lifeAlchemyMode","lifeAlchemySize","lifeAlchemyDuration"],"impact":["lifeImpact","lifeImpactMode","lifeImpactReach","lifeImpactPower"],"motion":["lifeBehavior","lifeForce","lifeCollision","lifeElasticity","lifeAmount","lifePopulation","lifeSize","lifeSpeed","lifeVariation"],"appearance":["lifeShell","lifePores","lifeSpecies","lifeForm","lifeHue","lifeDetail","lifePulse","lifeBlend"],"appendages":["lifeAppendage","lifeAppendageLength","lifeAppendageMotion","lifeAppendageDetail","lifeMembrane"],"optics":["lifeOptics","lifeOpticMode","lifeOpticPower","lifeOpticDispersion"],"evolution":["lifeEvolution","lifeBirthRate","lifeMutation","lifeMortality"],"threads":["lifeTrail","lifeTrailLength","lifeTrailWidth","lifeTrailStyle"]};
const modes={lifeNetworkMode:5,lifeAlchemyMode:5,lifeImpactMode:5,lifeBehavior:9,lifeForm:12,lifeAppendageDetail:4,lifeOpticMode:7,lifeTrailStyle:5};
export function shuffleLife(random=Math.random,group){
 const out={};
 for(const k of group?lifeGroups[group]:Object.values(lifeGroups).flat())out[k]=modes[k]?(Math.floor(random()*modes[k])+.5)*100/modes[k]:10+random()*80;
 if(!group){for(const k of ["lifeAppendage","lifeOptics","lifeEvolution","lifeTrail","lifeImpact","lifeAlchemy","lifeNetwork"])if(random()<.5)out[k]=0;out.lifePopulation=8+random()*45;out.lifeAmount=40+random()*55;}
 return out;
}
export const lifeRecipes={
 "Silica ballet":{lifeAmount:85,lifePopulation:35,lifeForm:46,lifeBehavior:28,lifeShell:85,lifePores:65,lifeOptics:25,lifeOpticMode:22},
 "Prismatic plankton":{lifeAmount:90,lifePopulation:25,lifeForm:96,lifeBehavior:50,lifeOptics:90,lifeOpticMode:36,lifeOpticDispersion:85,lifeAppendage:50},
 "Radioactive nursery":{lifeAmount:85,lifePopulation:10,lifeEvolution:100,lifeBirthRate:85,lifeMutation:90,lifeMortality:30,lifeForm:96,lifeBehavior:95},
 "Silk goblins":{lifeAmount:90,lifePopulation:25,lifeBehavior:61,lifeTrail:95,lifeTrailLength:100,lifeTrailWidth:35,lifeTrailStyle:90,lifeAppendage:60},
 "Quiet microcosm":{lifeAmount:45,lifePopulation:20,lifeSpeed:15,lifeForm:38,lifeShell:70,lifePores:35,lifePulse:20}
};
