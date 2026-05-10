import Groq from 'https://esm.run/groq-sdk';

const apiKey = "Your API KEY";//if you're cloning this repo
const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
const statMap = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1 };

const getStat = (val) => typeof val === 'number' ? val : (statMap[val] || 3);
const UserStandName = new URLSearchParams(window.location.search).get('stand');
const archive = JSON.parse(localStorage.getItem("standArchive") || "[]");
const playerFighter = archive.find(s => s.name === UserStandName);
const rollText = document.getElementById('roll-text')
const title = document.querySelector('h1');
let gameState = {
    player: null,
    enemy: null,
    bossIndex: 0,
    isGameOver: false
};

const bosses = [
    {name:"Atum",stats:{Power:'D',Speed:'D',Precision:'C',Durability:'D',Potential:'D'}},
    {name:"Sun",stats:{Power:'D',Speed:'E',Precision:'E',Durability:'D',Potential:'C'}},
    {name:"Dark Blue Moon",stats:{Power:'C',Speed:'B',Precision:'D',Durability:'D',Potential:'C'}},
    {name:"Horus",stats:{Power:'B',Speed:'C',Precision:'D',Durability:'D',Potential:'C'}}, 
    {name:"Hermit Purple",stats:{Power:'D',Speed:'C',Precision:'D',Durability:'A',Potential:'C'}},
    {name:"The Fool",stats:{Power:'B',Speed:'C',Precision:'E',Durability:'C',Potential:'B'}},
    {name:"Anubis",stats:{Power:'B',Speed:'D',Precision:'B',Durability:'A',Potential:'D'}},
    {name:"Hanged Man",stats:{Power:'C',Speed:'B',Precision:'B',Durability:'B',Potential:'B'}},
    {name:"Silver Chariot",stats:{Power:'D',Speed:"A",Precision:'B',Durability:'B',Potential:'B'}},
    {name:"Hierophant Green",stats:{Power:'C',Speed:'B',Precision:'A',Durability:'B',Potential:'B'}},
    {name:"Magician's Red",stats:{Power:'A',Speed:'C',Precision:'C',Durability:'B',Potential:'B'}},
    {name:"The World",stats:{Power:'A',Speed:'A',Precision:'C',Durability:'B',Potential:'A'}},
    {name:"Star Platinum",stats:{Power:'A',Speed:'A',Preciison:'C',Durability:'A',Potential:'A'}}
];

function initBattle(chosenStand) {
    gameState.player = {
        name: chosenStand.name,
        hp: getStat(chosenStand.stats.Durability) * 20,
        maxhp: getStat(chosenStand.stats.Durability) * 20,
        power: getStat(chosenStand.stats.Power),
        speed: getStat(chosenStand.stats.Speed),
        precision: getStat(chosenStand.stats.Precision),
        potential: chosenStand.stats.Potential
    };
}

function initEnemy(bossIndex = 0) {
    const boss = bosses[bossIndex];
    gameState.enemy = {
        name: boss.name,
        hp: getStat(boss.stats.Durability) * 20,
        maxhp: getStat(boss.stats.Durability) * 20,
        power: getStat(boss.stats.Power),
        speed: getStat(boss.stats.Speed),
        precision: getStat(boss.stats.Precision),
        potential: boss.stats.Potential
    };
}

function checkHit(attacker) {
    const precisionMap = { 5: 95, 4: 85, 3: 75, 2: 65, 1: 50 };
    const hitChance = precisionMap[attacker.precision] || 75;
    const roll = Math.floor(Math.random() * 100) + 1;
    return roll <= hitChance;
}

function determineOrder(player, enemy) {
    const pTotal = player.power + player.speed + player.precision;
    const eTotal = enemy.power + enemy.speed + enemy.precision;
    const pPriority = player.speed + (pTotal / 100);
    const ePriority = enemy.speed + (eTotal / 100);
    return pPriority >= ePriority ? "player" : "enemy";
}

function calculateDamage(attacker, d6Roll) {
    const potentialRanges = {
        'A': [0.8, 1.0], 'B': [0.6, 0.8], 'C': [0.4, 0.6], 'D': [0.2, 0.4], 'E': [0.1, 0.2]
    };
    const range = potentialRanges[attacker.potential] || [0.5, 0.5];
    const critValue = Math.random() * (range[1] - range[0]) + range[0];
    return Math.max(1, Math.floor(attacker.power * critValue * d6Roll * 2));
}

function executeAttack(attacker, defender) {
    const log = document.getElementById('battle-log');
    if (checkHit(attacker)) {
        const d6 = Math.floor(Math.random() * 6) + 1;
        const damage = calculateDamage(attacker, d6);
        defender.hp = Math.max(0, defender.hp - damage);
        if (log) log.innerHTML += `<p><strong>${attacker.name}</strong> hits for ${damage} damage!</p>`;
        rollText.innerText = `Nice! your attack got multiplied by your dice roll, ${d6}`
    } else {
        if (log) log.innerHTML += `<p>${attacker.name} missed!</p>`;
    }
}

async function BattleManager() {
    if (gameState.isGameOver) return;
    
    const log = document.getElementById('battle-log');
    if (log) log.innerHTML = ""; 

    const first = determineOrder(gameState.player, gameState.enemy);
    const actors = first === "player" 
        ? [gameState.player, gameState.enemy] 
        : [gameState.enemy, gameState.player];

    executeAttack(actors[0], actors[1]);
    updateUI();
    if (actors[1].hp <= 0) return endGame(actors[0], actors[1]);

    executeAttack(actors[1], actors[0]);
    updateUI();
    if (actors[0].hp <= 0) return endGame(actors[1], actors[0]);
}

function updateUI() {
    const pBar = document.getElementById('player-hp-bar');
    const eBar = document.getElementById('enemy-hp-bar');
    if (pBar) pBar.style.width = `${(gameState.player.hp / gameState.player.maxhp) * 100}%`;
    if (eBar) eBar.style.width = `${(gameState.enemy.hp / gameState.enemy.maxhp) * 100}%`;
    renderMap()    
    if (title) title.innerText = `${gameState.player.name} vs ${gameState.enemy.name}`;
}

async function endGame(winner, loser) {
    const emptyDiv = document.getElementById('ProgressButtonHolder');
    gameState.isGameOver = true;
    const log = document.getElementById('battle-log');
    if (log) log.innerHTML += `<h3>${winner.name} IS THE WINNER!</h3>`;
    await getBattleNarration(winner, loser);
    if (winner === gameState.player && gameState.bossIndex < bosses.length - 1) {
        emptyDiv.innerHTML = `<button class="NextButton" id="next-level">Next Opponent</button>`;
        document.getElementById('next-level').addEventListener('click', startNextLevel);
    } else {
        emptyDiv.innerHTML = `<button class="returnToArchive" id="returnToArchive">Return to Archive</button>`;
        document.getElementById('returnToArchive').addEventListener('click', () => {
            window.location.href = "archive.html";
        });
    }
}

function startNextLevel() {
    gameState.bossIndex++;
    gameState.isGameOver = false;
    document.getElementById('ProgressButtonHolder').innerHTML = "";
    document.getElementById('battle-log').innerHTML = "<p>A new challenger approaches!</p>";
    gameState.player.hp = gameState.player.maxhp;
    
    initEnemy(gameState.bossIndex);
    updateUI();
}

async function getBattleNarration(winner, loser) {
    const log = document.getElementById('battle-log');
    try {
        const completion = await groq.chat.completions.create({
            messages: [{
                role: "user",
                content: `Stand A: ${gameState.player.name}, Stand B: ${gameState.enemy.name}. Winner: ${winner.name}. Narrative: 3 sentences, JoJo style, chaotic and hilarious.`
            }],
            model: "llama-3.1-8b-instant",
        });
        if (log) log.innerHTML += `<div class='narration'>${completion.choices[0].message.content}</div>`;
    } catch (e) {
        console.error("AI narration failed", e);
    }
}
function renderMap() {
    const mapContainer = document.getElementById('boss-map');
    if (!mapContainer) return;
    mapContainer.innerHTML = ''; 
    bosses.forEach((boss, index) => {
        const node = document.createElement('div');
        node.className = 'node';
        if (index < gameState.bossIndex) {
            node.classList.add('completed');
        } else if (index === gameState.bossIndex) {
            node.classList.add('active');
        }
        node.title = boss.name;
        mapContainer.appendChild(node); 
    });
}

document.getElementById('roll-button')?.addEventListener('click', BattleManager);

if (playerFighter) {
    initBattle(playerFighter);
    initEnemy(gameState.bossIndex);
    updateUI();
    renderMap()
} else {
    window.location.href = "archive.html";
}