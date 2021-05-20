module.exports = {
    name: 'string',
    description: 'string',
    userAddress: 'string',
    hasFragment: {
      type: "relationships", 
      target: "Fragment", 
      relationship: "HAS_FRAGMENT", 
      direction: "out",
      properties : {
        has: 'integer'
      },
      eager: true
    }, 
    hasArtifact: {
      type: "relationships", 
      target: "Artifact", 
      relationship: "HAS_ARTIFACT", 
      direction: "out",
      properties: {
        selling: "boolean"
      },
      eager: true
    }, 
    solved: {
      type: "relationships", 
      target: "Enigme", 
      relationship: "SOLVED", 
      direction: "out",
      eager: true
    },
    created: {
      type: "relationships", 
      target: "Auction", 
      relationship: "CREATED",
      direction: "out", 
      eager: true
    },
}