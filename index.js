const { Ed25519Keypair } = require("@mysten/sui/keypairs/ed25519");
const { decodeSuiPrivateKey } = require("@mysten/sui/cryptography");
const fs = require("fs");
const axios = require("axios");

const CONFIG = {
    PRIVATE_KEYS_FILE: 'privatekey.txt',
    OUTPUT_CODE_FILE: 'code.txt'
};

let results = [];

function readFileLines(filename) {
    try {
        if (!fs.existsSync(filename)) return [];
        return fs.readFileSync(filename, 'utf8')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.startsWith('#'));
    } catch (error) {
        return [];
    }
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function decodePrivateKey(pkInput) {
    try {
        const { secretKey } = decodeSuiPrivateKey(pkInput);
        const keypair = Ed25519Keypair.fromSecretKey(secretKey);
        return { success: true, address: keypair.getPublicKey().toSuiAddress() };
    } catch (error) {
        return { success: false };
    }
}

async function fetchUserInfo(address) {
    try {
        const response = await axios.get(
            `https://api-test.creek.finance/api/user/info/${address}`,
            { timeout: 15000, headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
    } catch (error) {
        return null;
    }
}

async function registerWallet(address) {
    try {
        const response = await axios.post(
            'https://api-test.creek.finance/api/user/connect',
            { walletAddress: address, inviteCode: null },
            { timeout: 30000, headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
    } catch (error) {
        return null;
    }
}

async function processWallet(pkString, index, total) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`[${index}/${total}] Processing Wallet`);
    console.log('='.repeat(80));
    
    const decoded = decodePrivateKey(pkString);
    if (!decoded.success) {
        console.log(`❌ Failed to decode`);
        return null;
    }
    
    const address = decoded.address;
    console.log(`📍 ${address}`);
    
    console.log(`🔄 Fetching...`);
    let apiResponse = await fetchUserInfo(address);
    
    if (!apiResponse) {
        console.log(`⚠️  Not registered, registering...`);
        const regResponse = await registerWallet(address);
        if (!regResponse || regResponse.code !== 0) {
            console.log(`❌ Registration failed`);
            return null;
        }
        console.log(`✅ Registered!`);
        await delay(1000);
        apiResponse = await fetchUserInfo(address);
    } else {
        console.log(`✅ Found!`);
    }
    
    if (!apiResponse || !apiResponse.data) {
        console.log(`❌ No data`);
        return null;
    }
    
    const data = apiResponse.data;
    const user = data.user;
    
    if (!user) {
        console.log(`❌ No user`);
        return null;
    }
    
    const walletInfo = {
        id: user.id,
        address: user.wallet_address || address,
        inviteCode: user.invite_code,
        totalPoints: user.total_points,
        rank: user.rank,
        inviteCount: user.invite_count,
        inviteesTotalPoints: user.invitees_total_points,
        hasCheckedIn: data.has_checked_in_today
    };
    
    console.log(`\n👤 ACCOUNT:`);
    console.log(`   Code: ${walletInfo.inviteCode} | Points: ${walletInfo.totalPoints} | Rank: ${walletInfo.rank}`);
    console.log(`   Invites: ${walletInfo.inviteCount} | Invitees Pts: ${walletInfo.inviteesTotalPoints}`);
    console.log(`   Check-in: ${walletInfo.hasCheckedIn ? '✅' : '❌'}`);
    
    // ✅ FIX: Define completed dan incomplete di awal
    const badges = Array.isArray(data.badges) ? data.badges : [];
    const completed = badges.filter(b => b.is_completed === true);
    const incomplete = badges.filter(b => b.is_completed === false);
    
    if (badges.length === 0) {
        console.log(`\n📋 BADGES: None`);
    } else {
        console.log(`\n📋 BADGES (${completed.length}/${badges.length} completed):`);
        
        if (completed.length > 0) {
            console.log(`\n   ✅ COMPLETED (${completed.length}):`);
            completed.forEach((b, i) => {
                const date = new Date(b.completed_at).toISOString().substring(0, 10);
                console.log(`      ${i + 1}. [${b.badge_id}] ${b.badge_name} (TRUE)`);
                console.log(`         +${b.points_reward}pts | ${date}`);
            });
        }
        
        if (incomplete.length > 0) {
            console.log(`\n   ❌ INCOMPLETE (${incomplete.length}):`);
            incomplete.forEach((b, i) => {
                const prog = `${b.current_count}/${b.required_count}`;
                const pct = Math.round((b.current_count / b.required_count) * 100);
                console.log(`      ${i + 1}. [${b.badge_id}] ${b.badge_name} (FALSE)`);
                console.log(`         +${b.points_reward}pts | ${prog} (${pct}%)`);
            });
        }
        
        const earnedPts = completed.reduce((s, b) => s + b.points_reward, 0);
        const remainPts = incomplete.reduce((s, b) => s + b.points_reward, 0);
        console.log(`\n   💰 ${earnedPts}pts earned | ${remainPts}pts remaining`);
    }
    
    results.push({
        address: walletInfo.address,
        inviteCode: walletInfo.inviteCode,
        totalPoints: walletInfo.totalPoints,
        rank: walletInfo.rank,
        badgesCompleted: completed.length,
        badgesTotal: badges.length
    });
    
    return walletInfo;
}

async function main() {
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║             CREEK.FI BADGES CHECKER                           ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
    const privateKeys = readFileLines(CONFIG.PRIVATE_KEYS_FILE);
    if (!privateKeys.length) {
        console.log(`❌ ${CONFIG.PRIVATE_KEYS_FILE} not found`);
        return;
    }
    
    console.log(`✓ Loaded ${privateKeys.length} key(s)\n`);
    
    let success = 0;
    for (let i = 0; i < privateKeys.length; i++) {
        const result = await processWallet(privateKeys[i], i + 1, privateKeys.length);
        if (result) success++;
        if (i < privateKeys.length - 1) await delay(2000);
    }
    
    console.log(`\n\n${'='.repeat(80)}`);
    console.log(`SUMMARY`);
    console.log('='.repeat(80));
    console.log(`✅ Processed: ${success}/${privateKeys.length}\n`);
    
    // Export codes only
    if (results.length) {
        const codes = results.map(r => r.inviteCode).filter(c => c);
        if (codes.length) {
            fs.writeFileSync(CONFIG.OUTPUT_CODE_FILE, codes.join('\n') + '\n');
            console.log(`✅ Codes → ${CONFIG.OUTPUT_CODE_FILE}`);
        }
    }
    
    // Summary table
    if (results.length) {
        console.log(`\n${'='.repeat(90)}`);
        console.log('WALLETS SUMMARY');
        console.log('='.repeat(90));
        console.log('┌────┬──────────────────────┬──────────┬────────┬──────┬──────────┐');
        console.log('│ No │ Address              │ Code     │ Points │ Rank │ Badges   │');
        console.log('├────┼──────────────────────┼──────────┼────────┼──────┼──────────┤');
        
        results.forEach((r, i) => {
            const addr = r.address.substring(0, 20);
            const code = r.inviteCode.substring(0, 8);
            const pts = String(r.totalPoints);
            const rank = String(r.rank);
            const badges = `${r.badgesCompleted}/${r.badgesTotal}`;
            
            console.log(`│${String(i+1).padStart(3)} │ ${addr.padEnd(20)} │ ${code.padEnd(8)} │ ${pts.padEnd(6)} │ ${rank.padEnd(4)} │ ${badges.padEnd(8)} │`);
        });
        
        console.log('└────┴──────────────────────┴──────────┴────────┴──────┴──────────┘\n');
    }
}

main().catch(e => console.error(`❌ Error: ${e.message}`));
