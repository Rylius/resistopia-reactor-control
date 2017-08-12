<template>
    <section class="content">
        <h2>Backups</h2>

        <ul v-if="backups.length">
            <li v-for="backup in backups">
                {{ backup }}
            </li>
        </ul>
        <div v-else-if="error">
            <p>
                Fehler bei der Kommunikation mit dem Backend
            </p>
            <p>
                <button @click="fetchBackups">Erneut versuchen</button>
            </p>
        </div>
        <div v-else>
            Lädt...
        </div>
    </section>
</template>

<script>
    const BACKEND_URL = process.env.RESISTOPIA_BACKEND_URL;

    export default {
        name: 'backups',
        data() {
            return {
                error: false,
                backups: [],
            };
        },
        methods: {
            fetchBackups() {
                fetch(BACKEND_URL + '/api/v1/backups', {method: 'get'})
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Request failed: HTTP ${response.status}: ${response.statusText}`);
                        }

                        return response.json();
                    })
                    .then(data => {
                        this.backups.splice(0);
                        this.backups.push(...data);
                    })
                    .catch(error => {
                        // TODO
                        this.error = true;
                        console.error(error);
                    });
            },
        },
        created() {
            this.fetchBackups();
        },
    };
</script>
