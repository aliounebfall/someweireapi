module.exports = {
    numero: 'integer',
    titre: 'string', 
    solution: 'string', 
    rewards: {
        type: "relationships", 
        target: "Fragment", 
        relationship: "REWARDS", 
        direction: "out",
        properties : {
          quantite: 'integer'
        },
        eager: true
      }
}