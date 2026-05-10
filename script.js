import Groq from 'https://esm.run/groq-sdk';
const apiKey = "YOUR API KEY";//if you're cloning this repo
const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
let myChart = null;
let HamonDisplayTag = null;
const HAMON_MAX = 100;
const COST_PER_GEN = 20;
const REGEN_MS = 300000;

function initializeHamonDisplay() {
    HamonDisplayTag = document.getElementById("HamonDisplay");
    if (HamonDisplayTag) {
        const hamon = getHamon();
        updateHamon(hamon);
        HamonDisplayTag.innerText = `Hamon: ${hamon}`;
    }
}

function getHamon(){
    let data = JSON.parse(localStorage.getItem('userStats') || '{"hamon":100, "lastUpdate": '+Date.now()+'}');
    let elapsed = Date.now() - data.lastUpdate;
    let regenerated = Math.floor(elapsed/REGEN_MS);
    let current_hamon = Math.min(HAMON_MAX, data.hamon+regenerated) ;
    return current_hamon;
}
function updateHamon(newHamon){
    localStorage.setItem("userStats",JSON.stringify({
        hamon: newHamon,
        lastUpdate:Date.now()
    }))
    if (HamonDisplayTag) {
        HamonDisplayTag.innerText = `Hamon: ${newHamon}`;
    }
}

async function generate() {
        const btn = document.querySelector('.generate');
        const StandName = document.getElementById("StandTitle");
        const StandDes = document.getElementById("StandDescription");
    if (getHamon() >= COST_PER_GEN){
        btn.disabled = true;
        btn.textContent = "Generating...";
        updateHamon(getHamon()-COST_PER_GEN)
        StandName.innerText = "Scanning the Multiverse...";
        StandDes.innerText = "";
    const promptHooks = [
        "A 1960s British Invasion hit",
        "A 1970s disco anthem",
        "A 1980s synthpop single",
        "A 1990s alternative rock track",
        "A 2000s emo song",
        "A 2010s indie pop hit",
        "A 2020s experimental electronic track",
        "A 1970s psychedelic rock track",
        "A 1980s hair metal song",
        "A 1990s trip-hop track",
        "A classic Motown hit",
        "A reggae song from the 1970s",
        "A modern lo-fi hip-hop track",
        "A 90s Britpop song",
        "A 1980s post-punk track",
        "A 70s progressive metal song",
        "An obscure folk song from the 1960s",
        "A 2000s garage rock single",
        "A 1990s ska punk track",
        "A contemporary R&B track",
        "A heartbreak song from the 1980s",
        "A dancefloor anthem from the 2000s",
        "A summer road trip song",
        "A melancholic piano track",
        "A love song from the 1960s",
        "A protest song from the 1970s",
        "A feel-good 1980s tune",
        "A late-night jazz track",
        "A cinematic soundtrack piece",
        "An instrumental track from the 1990s",
        "A B-side track from a famous band",
        "A one-hit wonder from the 1980s",
        "A debut single from a 1990s artist",
        "A song from an underground 2000s rapper",
        "A cover song by a classic rock band",
        "A collaboration between two indie artists",
        "A remix of a 90s club track",
        "An unreleased demo from the 1970s",
        "A rare live performance track",
        "A hidden gem from a popular album",
        "A French pop song from the 1960s",
        "A Japanese city pop track",
        "A Brazilian bossa nova classic",
        "An Afrobeat song from the 1970s",
        "A Scandinavian synth track",
        "A Canadian indie band track",
        "A Jamaican dub reggae song",
        "A West Coast hip-hop track from the 1990s",
        "A Southern soul song from the 1960s",
        "A K-pop track from the 2010s",
        "A track with under 100,000 streams",
        "An album opener thats rarely remembered",
        "A song never released as a single",
        "A forgotten 80s B-side",
        "A vinyl-exclusive track",
        "A song only released digitally",
        "A soundtrack track from a cult movie",
        "A forgotten 90s radio hit",
        "An early demo of a now-famous artist",
        "A niche genre track, like vaporwave or math rock",
        "A jazz fusion solo",
        "A prog rock instrumental",
        "A 90s electronic beat",
        "A funk bassline showcase",
        "A guitar-driven blues song",
        "A drum-heavy track from the 80s",
        "A synthwave instrumental",
        "A complex classical crossover track",
        "A violin-led experimental track",
        "A piano ballad from the 1970s",
        "A concept album track",
        "A song with an unusual time signature",
        "A track with spoken word vocals",
        "A duet that shouldnt work",
        "A live jam session track",
        "A remix that became more famous than the original",
        "A song inspired by literature",
        "A track with a political message",
        "A song recorded in a unique location",
        "A self-released track that went viral",
        "A track with less than 10,000 monthly listeners",
        "A song from an unsigned band",
        "A sleeper hit from Spotifys editorial playlists",
        "A track trending in niche TikTok communities",
        "A track with an unusual fan cult following",
        "A sleeper track from a top-charting album",
        "A deep album cut that is critically acclaimed",
        "A song with quirky instrumentation",
        "An underrated song from a famous artist",
        "A track thats unexpectedly catchy",
        "A 70s disco rock hybrid",
        "An 80s synth punk track",
        "A 90s grunge rap crossover",
        "A 2000s indie electronic track",
        "A 2010s lo-fi folk song",
        "A 60s soul rock track",
        "A 70s jazz funk track",
        "An 80s neo-soul song",
        "A 90s trip-hop jazz track",
        "A modern post-rock anthem"
    ];
        const hook = promptHooks[Math.floor(Math.random() * promptHooks.length)];

        try {
            const res1 = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile", 
                messages: [
                    { 
                        role: "system", 
                        content: `You are a creative naming engine. Output ONLY a Stand name based on ${hook}. 
                        STRICT RULES: 
                        - NEVER use 'Bohemian Rhapsody', 'Stairway to Heaven', 'King Crimson', or 'Midnight Serenade'.
                        - The name must sound like a JoJo's Bizarre Adventure Stand.
                        - Output ONLY the name itself.` 
                    }
                ],
                temperature: 1.3,   
                presence_penalty: 0.9,  
                frequency_penalty: 0.9   
            });

            const cleanName = res1.choices[0].message.content.replace(/\*/g, "").trim();
            StandName.innerText = cleanName;
            StandDes.innerText = "Reading user's spirit...";
            const res2 = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system",
                        content: "Act as Hirohiko Araki. Describe the Stand in 3 sentences total. Format: Appearance, Ability, and Stats [Power:A, Speed:B, Range:C, Durability:D, Precision:E, Potential:A]. Vary the ratings, make some stands overpowered in every aspect , make some overpowered in majority , make some decent in all of the aspects , make some decent in majority , and make some straight up useless." 
                    },
                    { role: "user", content: `Describe the Stand: ${cleanName}` }
                ],
                temperature: 0.8,
                stream: false
            });

            const cleanDescription = res2.choices[0].message.content.replace(/\*/g, "").trim();
            StandDes.innerText = cleanDescription;
            updateRadarChart(cleanDescription);
            if (myChart) {
                const statsData = myChart.data.datasets[0].data;
                saveToArchive(cleanName, statsData);
            }

        } catch (e) {
            console.error("Cloud Generation Error:", e);
            StandDes.innerText = "The connection to the cloud was severed. Verify your API key.";
            updateHamon(getHamon()+COST_PER_GEN)
        } finally {
            btn.disabled = false;
            btn.textContent = "Generate Stand";
        }
    }
    else{
        StandDes.innerText = "You do not have enough Hamon for this task (you must have atleast 20)";
        btn.disabled = false;
    }
}

function updateRadarChart(text) {
    const ctx = document.getElementById('standChart').getContext('2d');
    const mapping = { 'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1 };
    const statsLabels = ["Power", "Speed", "Range", "Durability", "Precision", "Potential"];
    
    const dataValues = statsLabels.map(label => {
        const match = text.match(new RegExp(`${label}:\\s*([A-E])`, 'i'));
        return match ? mapping[match[1].toUpperCase()] : 3;
    });

    if (myChart) { myChart.destroy(); }
    
    myChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: statsLabels,
            datasets: [{
                label: 'Stand Parameters',
                data: dataValues,
                backgroundColor: 'rgba(165, 204, 255, 0.2)',
                borderColor: 'rgba(165, 204, 255, 0.8)', 
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 255, 255, 0.9)', 
                pointBorderColor: 'rgba(165, 204, 255, 1)',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.05)' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    pointLabels: {
                        color: '#a5ccff', 
                        font: { family: 'Quicksand', size: 14 }
                    },
                    min: 0,
                    max: 5,
                    ticks: { display: false }
                }
            }
        }
    });
}

function saveToArchive(name, statsArray) {
    if (!statsArray || !statsArray.length) return;

    const mapping = { 5: 'A', 4: 'B', 3: 'C', 2: 'D', 1: 'E' };
    const statsLabels = ["Power","Speed","Range","Durability","Precision","Potential"];
    const individualStats = {};
    statsLabels.forEach((label,i) =>{
        individualStats[label] = statsArray[i];
    });
    const totalScore = statsArray.reduce((a,b)=> a+b,0)*20;
    const avg = statsArray.reduce((a, b) => a + b, 0) / statsArray.length;
    let avgTier;
    if (avg === 5){
        avgTier="S";
    }
    else{
        avgTier= mapping[Math.round(avg)]||'F';
    }

    let archive = JSON.parse(localStorage.getItem('standArchive') || '[]');
    if (archive.some(s => s.name.toLowerCase() === name.toLowerCase())) {
        return;
    }

    archive.push({
         name:name, 
         stats:individualStats,
         avgTier: avgTier,
         totalScore:totalScore, 
         timestamp: new Date().toISOString() 
        });
    localStorage.setItem('standArchive', JSON.stringify(archive));
}

document.addEventListener('DOMContentLoaded', initializeHamonDisplay);
window.generate = generate;