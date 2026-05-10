let filter;

function renderArchive() {
    const container = document.getElementById('archiveContainer');
    let archive = JSON.parse(localStorage.getItem('standArchive') || '[]');
    container.innerHTML = '';
    const oldEmpty = document.querySelector('.empty-state');
    if (oldEmpty) oldEmpty.remove();
    if (archive.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        emptyDiv.innerHTML = `
            <p>No Stands in your archive yet.</p>
            <p style="font-size: 0.95rem; color: #888;">Generate your first Stand to add it to the archive!</p>
            <a href="index.html" class="back-button">Create Stand</a>
        `;
        container.parentElement.appendChild(emptyDiv);
        return;
    }
    const sortValue = filter.value;
    archive.sort((a, b) => {
        switch (sortValue) {
            case 'date_asc':
                return new Date(a.timestamp) - new Date(b.timestamp);
            case 'date_des':
                return new Date(b.timestamp) - new Date(a.timestamp);
            case 'stats_asc':
                return a.totalScore - b.totalScore;
            case 'stats_des':
                return b.totalScore - a.totalScore;
            default:
                return 0;
        }
    });
    archive.forEach(stand => {
        const card = document.createElement('div');
        card.className = 'archive-card';
        const tierClass = `tier-${stand.avgTier}`;
        const standFormattedName = webFormat(stand.name);
        card.innerHTML = `
            <h3>${escapeHtml(stand.name)}</h3>
            <div class="tier-letter ${tierClass}">${stand.avgTier}</div>
            <button class="Battle" onclick="window.location.href='battle.html?stand=${standFormattedName}'">Battle</button>
        `;
        container.appendChild(card);
    });
}
function webFormat(name){
    return encodeURIComponent(name.trim());
}
function clearArchive() {
    if (confirm('Are you sure you want to clear your entire Stand archive?')) {
        localStorage.removeItem('standArchive');
        renderArchive();
    }
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    filter = document.getElementById("filter");
    if (filter) {
        filter.addEventListener("change", renderArchive);
    }
    renderArchive();
});