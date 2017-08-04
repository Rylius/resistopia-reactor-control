<template>
    <section class="content">
        <h2>Übersicht</h2>

        <div>
            <button class="danger" @click="reset">Reset</button>

            <router-link :to="{name: 'backups'}">Alle Backups</router-link>
        </div>

        <div>
            <button class="danger" :disabled="!state.global.effects" @click="disableEffects">OT</button>
            <button class="danger" :disabled="state.global.effects" @click="enableEffects">IT</button>
        </div>

        <div>
            <ul>
                <li>
                    <router-link :to="{name: 'modify-simulation'}">Simulation bearbeiten</router-link>
                </li>
                <li>
                    <router-link :to="{name: 'edit-safe-state'}">Sicheren Zustand bearbeiten</router-link>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
    export default {
        name: 'dashboard',
        data() {
            return {
                state: {
                    stateMachines: {},
                    global: {},
                },
            };
        },
        methods: {
            reset() {
                // TODO
            },
            enableEffects() {
                // TODO
            },
            disableEffects() {
                // TODO
            },
        },
    };
</script>
