<template>
    <div id="app">
        <h1>Reaktor-/Wassersimulation</h1>
        <router-view v-if="simulation" :simulation="simulation"></router-view>
        <div v-else-if="error">
            <p>
                Fehler bei der Kommunikation mit dem Backend
            </p>
            <p>
                <button @click="fetchSimulation">Erneut versuchen</button>
            </p>
        </div>
        <div v-else>
            Lädt...
        </div>
    </div>
</template>

<style lang="less">
    @import "assets/less/stylesheet";
</style>

<script>
    const BACKEND_URL = process.env.RESISTOPIA_BACKEND_URL;

    export default {
        name: 'app',
        data() {
            return {
                simulation: null,
                error: false,
            };
        },
        methods: {
            fetchSimulation() {
                this.simulation = null;
                this.error = false;
                fetch(BACKEND_URL + '/api/v1/simulation', {method: 'get'})
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Request failed: HTTP ${response.status}: ${response.statusText}`);
                        }

                        return response.json();
                    })
                    .then(data => {
                        this.simulation = data;
                    })
                    .catch(error => {
                        // TODO
                        this.error = true;
                        console.error(error);
                    });
            },
        },
        created() {
            this.fetchSimulation();
        },
    };
</script>
