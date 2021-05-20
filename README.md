# someweireapi
An Api to solve **riddles**, win **ERC20 tokens**, forge **ERC721 tokens** with random types and rarities, and trade them with decentralized **auctions**.

The API is a template, for a **decentralized riddle web game**. The goal is to solve riddles. Each riddle solved rewards an amount of ERC20 tokens, which are of 3 types, called **Weivellite**, **Weither** and **Weillenium**.

The player can then **forge** an ERC721 Token, named **Artifact**, with amounts of ERC20 tokens of the 3 types. The amounts and a **RNG** will determine the type and rarity of the Artifcact : **Common**, **Rare** and **Legendary** rarities, and **Technology**, **Art** and **Material** types.

The player can then sell artifacts for Weivellite, Weither and Weillenium Tokens, by creating **decentralized auction contracts**.

To run the API, you will need :

* **Docker** : Install Docker, to pull images of Kafka, Zookeeper, Ganache and Neo4j.

* **Truffle**: Install Truffle, to **compile** and **deploy contracts**, and connect to the **Ganache Node**.

* A **Ganache-Cli** node, to simulate an ETH blockchain node, and interact with your contracts. Pull the docker image **trufflesuite/ganache-cli** 

* A **Zookeeper** node, to manage Kafka group ids. Pull the docker image **zookeeper**.

* A **Kafka** node, to subscribe to the **Someweiremicroservice** that **subscribes** to **blockchain events** and **publishes** transfer events for Weive Tokens and the Artifact Token to Kafka. Pull the docker image **confluentinc/cp-kafka**.

* An **Neo4J** node, as the database. Pull the docker image **neo4j**.

Edit the **.env** file with your custom URIs to run the API.
