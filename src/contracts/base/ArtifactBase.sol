// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma abicoder v2;

abstract contract ArtifactBase{
    enum Types {technology, art, material}

    enum Rarity {common, rare, legendary}

    enum Fragment {weivellite, weither, weillenium}

    struct Arts {
        Types artifactType;
        Rarity rarity;
    }

    struct Amounts {
        uint amountWeivellite;
        uint amountWeither;
        uint amountWeillenium;
    }

    struct Forge {
        uint[2][3] rarityForge;
        uint[2][4] typeForge;
    }

    Forge private  _forge;

    function _setForge() internal {
        uint[2] memory rarityForgeCommon;
        uint[2] memory rarityForgeRare;
        uint[2] memory rarityForgeLegendary;

        uint[2] memory typeForgeLowIndexesEven;
        uint[2] memory typeForgeUpperIndexesEven;
        uint[2] memory typeForgeAllIndexesEven;
        uint[2] memory typeForgeRegular;

        rarityForgeCommon[0] = 70;
        rarityForgeCommon[1] = 90;

        rarityForgeRare[0] = 20;
        rarityForgeRare[1] = 80;

        rarityForgeLegendary[0] = 10;
        rarityForgeLegendary[1] = 50;

        typeForgeLowIndexesEven[0] = 15;
        typeForgeLowIndexesEven[1] = 30;

        typeForgeUpperIndexesEven[0] = 10;
        typeForgeUpperIndexesEven[1] = 55;

        typeForgeAllIndexesEven[0] = 33;
        typeForgeAllIndexesEven[1] = 66;

        typeForgeRegular[0] = 10;
        typeForgeRegular[1] = 30;  

        _forge.rarityForge[0] = rarityForgeCommon;
        _forge.rarityForge[1] = rarityForgeRare;
        _forge.rarityForge[2] = rarityForgeLegendary;

        _forge.typeForge[0] = typeForgeLowIndexesEven;
        _forge.typeForge[1] = typeForgeUpperIndexesEven;
        _forge.typeForge[2] = typeForgeAllIndexesEven;
        _forge.typeForge[3] = typeForgeRegular;
    }

    function _forgeRarity(Amounts calldata amounts) internal view returns(Rarity rarity){
        uint total = amounts.amountWeivellite + amounts.amountWeither + amounts.amountWeillenium;
        Forge memory _forgeInstance = _forge;

        // Common artifacts are more likely to be crafted from 1 - 5 fragments
        // Rare artifacts are more likely to be crafted from 6 - 11 fragments
        // Legendary artifacts are more likely to be crafted from 12 fragments
        uint index = total / 6;

        uint randomPercent = 100 - uint256(blockhash(block.number - 1)) % 100;

        if(index > 2) index = 2;
        uint[2] memory rarityForge = _forgeInstance.rarityForge[index];

        if(randomPercent <= rarityForge[0]){
            rarity = Rarity.common;
        } else if (rarityForge[0] < randomPercent &&  randomPercent <= rarityForge[1]) {
            rarity = Rarity.rare;
        } else if ( randomPercent > rarityForge[1]) {
            rarity = Rarity.legendary;
        }
    }

    function _forgeType(Amounts calldata amounts) internal view returns(Types artifactType){

        bytes32[2] memory weivellite;
        bytes32[2] memory weither;
        bytes32[2] memory weillenium;

        Forge memory _forgeInstance = _forge;

        uint[2] memory typeForgeLowIndexesEven = _forgeInstance.typeForge[0];
        uint[2] memory typeForgeUpperIndexesEven = _forgeInstance.typeForge[1];
        uint[2] memory typeForgeAllIndexesEven = _forgeInstance.typeForge[2];
        uint[2] memory typeForgeRegular = _forgeInstance.typeForge[3];

        uint[2] memory _typeForge;

        weivellite[0] = bytes32(uint(Fragment.weivellite));
        weither[0] = bytes32(uint(Fragment.weither));
        weillenium[0] = bytes32(uint(Fragment.weillenium));


        weivellite[1] = bytes32(amounts.amountWeivellite);
        weither[1] = bytes32(amounts.amountWeither);
        weillenium[1] = bytes32(amounts.amountWeillenium);

        bytes32[2][3] memory toSort = [weivellite, weither, weillenium];

        uint randomPercent = 100 - uint256(blockhash(block.number - 1)) % 100;

        sort(toSort);

        bool oneEqualsTwo = toSort[0][1] == toSort[1][1];
        bool twoEqualsThree = toSort[1][1] == toSort[2][1];

        if(oneEqualsTwo && !twoEqualsThree) {
            _typeForge = typeForgeLowIndexesEven;
        } else if(!oneEqualsTwo && twoEqualsThree) {
            _typeForge = typeForgeUpperIndexesEven;
        } else if(oneEqualsTwo && twoEqualsThree){
            _typeForge = typeForgeAllIndexesEven;
        } else if (!oneEqualsTwo && !twoEqualsThree) {
            _typeForge = typeForgeRegular;
        }

        uint lowerTypeMaxVal = _typeForge[0];
        uint mediumTypeMaxVal = _typeForge[1];

        if(randomPercent <= lowerTypeMaxVal){
            artifactType = findType(toSort[0]);
        } else if (lowerTypeMaxVal < randomPercent &&  randomPercent <= mediumTypeMaxVal) {
            artifactType = findType(toSort[1]);
        } else if ( randomPercent > mediumTypeMaxVal) {
            artifactType = findType(toSort[2]);
        }
    }

    function sort(bytes32[2][3] memory array) internal pure returns (bytes32[2][3] memory){
        uint lengthIndex = array.length -1;

        for(uint i = 0; i < lengthIndex; i++){
            for(uint j = 0; j < lengthIndex - i; j++) {
                if(array[j][1] > array[j+1][1]){
                    bytes32[2] memory temp = array[j];
                    array[j] = array[j+1];
                    array[j+1] = temp;
                }
            }
        }

        return array;
    }


    function findType(bytes32[2] memory array) internal pure returns (Types artifactType){
             if(array[0] == bytes32(uint(Fragment.weivellite))) {artifactType = Types.technology;} 
        else if(array[0] == bytes32(uint(Fragment.weither))) artifactType = Types.art;
        else artifactType = Types.material;
    }
}