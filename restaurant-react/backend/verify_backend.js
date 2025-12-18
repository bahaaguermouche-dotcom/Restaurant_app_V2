
async function verify() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    try {
        console.log('Checking backend health...');
        const healthRes = await fetch('http://localhost:5000/api/health', { signal: controller.signal });
        const health = await healthRes.json();
        console.log('Health:', health);

        console.log('Checking dishes schema...');
        const dishesRes = await fetch('http://localhost:5000/api/dishes');
        const dishes = await dishesRes.json();

        if (dishes.length > 0) {
            const dish = dishes[0];
            if ('image_url' in dish) {
                console.log('✅ Success: image_url field exists!');
            } else {
                console.error('❌ Error: image_url field missing!');
                process.exit(1);
            }
        } else {
            console.log('⚠️ No dishes found to check schema.');
        }
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
        process.exit(1);
    }
}

verify();
