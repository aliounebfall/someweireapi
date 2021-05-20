// const ArtifactContract = artifacts.require("Artifact");

// contract("Artifact", accounts => {

//     let artifactToken;

//     before(async ()=> {
//         artifactToken = await ArtifactContract.new();
//     });

//     it("Should get artifact list", async () => {
//         //Given
//         //When
//         const result = await debug(artifactToken.getArtifacts.call());
//         //Then
//         console.log(result);
//     });

//     it("Should mint an artifact, with a chance of Legendary, and technology type", async () => {
//         //Given
//         let amounts = {
//             amountWeivellite: 7,
//             amountWeither: 3,
//             amountWeillenium: 2
//         }
//         let address = accounts[1];
//         //When
//         const result = await debug(artifactToken.mintArtifact.call(address, amounts));
//         //Then
//         console.log(result);
//     });
// })