// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "./base/ArtifactBase.sol";


contract Artifact is ERC721PresetMinterPauserAutoId, ArtifactBase{

    Arts[] public _artifacts;

    event Mint(uint256 indexed tokenId, Types indexed artifactType, Rarity indexed rarity);

    constructor() ERC721PresetMinterPauserAutoId("Artifact", "ARTFCS", "") {
        _setForge();
    }

    function mintArtifact(address to, Amounts calldata amounts) public virtual{
        require(hasRole(MINTER_ROLE, _msgSender()), "ERC721PresetMinterPauserAutoId: must have minter role to mint");
        uint nextId = _artifacts.length;

        require(!_exists(nextId), "ERC721: token already minted");

        // Forge type and rarity
        Rarity _forgedRarity = _forgeRarity(amounts);
        Types _forgedType = _forgeType(amounts);

        Arts memory _artifact = Arts({artifactType: _forgedType, rarity: _forgedRarity});

        _artifacts.push(_artifact);

        emit Mint(nextId, _forgedType, _forgedRarity);

        _mint(to, nextId);
    }

    function getArtifacts() public view returns (Arts[] memory){
        return _artifacts;
    }

    function getArtifact(uint artifactId) public view returns (Arts memory){
        require(_exists(artifactId), "ERC721: operator query for nonexistent token");
        return _artifacts[artifactId];
    }
}