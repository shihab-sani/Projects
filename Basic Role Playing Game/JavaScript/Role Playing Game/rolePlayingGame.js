let xp = 0;
let health = 100;
let gold = 50;
let currentWeaponIndex = 0;
let monsterHealth;
let fighting;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");

const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth"); 

const weapons = [
    {
        name: "Stick",
        power: 5
    },
    {
        name: "Dagger",
        power: 30
    },
    {
        name: "Claw Hammer",
        power: 50
    },
    {
        name: "Sword",
        power: 100
    }
];

const monsters = [
    {
        name: "Slime",
        level: 2,
        health: 15
    },
    {
        name: "Fanged Beast",
        level: 8,
        health: 60
    },
    {
        name: "Dragon",
        level: 20,
        health: 300
    }
]

const locations = [
    {
        name: "Town Square",
        "button text": ["Go to Store", "Go to Cave", "Fight Dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in the town square. You see a sign that says \"Store\"."
    },
    {
        name: "Store",
        "button text": ["Buy Health (10 gold)", "Buy a Weapon (30 gold)", "Go to Town Square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the Store."
    },
    {
        name: "Cave",
        "button text": ["Fight Slime", "Fight Fanged Beast", "Go to Town Square"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You enter the Cave. You see some monsters."
    },
    {
        name: "Fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster."
    },
    {
        name: "Kill Monster",
        "button text": ["Go to Town Square", "Go to Town Square", "Go to Town Square"],
        "button functions": [goTown, goTown, easterEgg],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    }, 
    {
        name: "Lose",
        "button text": ["REPLAY", "REPLAY", "REPLAY"],
        "button functions": [restart, restart, restart],
        text: "You die. &#x2620;"
    },
    {
        name: "Win",
        "button text": ["REPLAY", "REPLAY", "REPLAY"],
        "button functions": [restart, restart, restart],
        text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;"
    },
    {
        name: "Easter Egg",
        "button text": ["2", "8", "Go to Town Square?"],
        "button functions": [pickTwo, pickEight, goTown],
    }
];

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function updates(locations) {
    text.innerHTML = locations.text;
    monsterStats.style.display = "none";
    button1.innerText = locations["button text"][0];
    button2.innerText = locations["button text"][1];
    button3.innerText = locations["button text"][2];
    button1.onclick = locations["button functions"][0];
    button2.onclick = locations["button functions"][1];
    button3.onclick = locations["button functions"][2];
}

function goTown() {
    updates(locations[0]);
}

function goStore() {
    updates(locations[1]);
}

function goCave() {
    updates(locations[2]);
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        healthText.innerText = health;
        goldText.innerText = gold;
    } else {
        text.innerText = "You do not have enough gold to buy health.";
    }
}

function buyWeapon() {
    if (currentWeaponIndex < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeaponIndex++;
            let newWeapon = weapons[currentWeaponIndex].name;
            goldText.innerText = gold;
            text.innerText = `Now you have a ${newWeapon}.`;
            inventory.push(newWeapon);
            text.innerText += ` In your inventory you have: ${inventory}.`;
        } else {
            text.innerText = "You do not have enough gold to buy a weapon.";
        }
    } else {
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = `You sold a ${currentWeapon}.`;
        text.innerText += ` In your inventory you have: ${inventory}.`;
    } else {
        text.innerText = "Don't sell your only weapon!";
    }
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function goFight() {
    updates(locations[3]);
    monsterStats.style.display = "block";
    monsterName.innerText = monsters[fighting].name;
    monsterHealth = monsters[fighting].health;
    monsterHealthText.innerText = monsterHealth;
}

function attack() {
    text.innerText = `The ${monsters[fighting].name} attacks you!`;
    text.innerText += ` You attack the ${monsters[fighting].name} with your ${weapons[currentWeaponIndex].name}.`;
    health -= getMonsterAttackValue(monsters[fighting].level);

    if (isMonsterHit) {
        monsterHealth -= weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp) + 1;
    } else {
        text.innerText += " You missed!";
    }

    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;

    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        if (fighting === 2) {
            winGame();
        } else {
            defeatMonster();
        }
    }

    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += ` Your ${inventory.pop()} broke.`;
        currentWeaponIndex--;
    }  
}

function getMonsterAttackValue(level) {
    const hit = (level * 5) - (Math.floor(Math.random() * xp));
    return hit > 0 ? hit : 0;
}

function isMonsterHit() {
    return Math.random() > 0.2 || health < 20;
}

function dodge() {
    text.innerText = `You dodge the attack from the ${monsters[fighting].name}.`;
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    updates(locations[4]);
}

function lose() {
    updates(locations[5]);
}

function winGame() {
    updates(locations[6]);
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeaponIndex = 0;
    inventory = ["stick"];

    xpText.innerText = xp;
    healthText.innerText = health;
    goldText.innerText = gold;
    
    goTown();
}

function easterEgg() {
    updates(locations[7]);
}

function pickTwo() {
    pick(2);
}

function pickEight() {
    pick(8);
}

function pick(guess) {
    const numbers = [];

    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }
    text.innerText = `You picked ${guess}. Here are the numbers:\n`;
    for (let i = 0; i < 10; i++) {
        text.innerText += `${numbers[i]} \n`;
    }
    if (numbers.includes(guess)) {
        text.innerText += "Right! You win 20 gold.";
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 health.";
        health -= 10;
        healthText.innerText = health;
        if (health <= 0) {
            lose();
        }
    }
}