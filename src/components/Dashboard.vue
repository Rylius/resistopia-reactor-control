<template>
    <section class="content">
        <h2>
            Übersicht
            <button @click="refresh">Aktualisieren</button>
        </h2>

        <nav>
            <ul>
                <li>
                    <router-link :to="{name: 'backups'}">Backups</router-link>
                </li>
            </ul>

            <!--<ul>-->
            <!--<li>-->
            <!--<router-link :to="{name: 'modify-simulation'}">Simulation bearbeiten</router-link>-->
            <!--</li>-->
            <!--<li>-->
            <!--<router-link :to="{name: 'edit-safe-state'}">Sicheren Zustand bearbeiten</router-link>-->
            <!--</li>-->
            <!--</ul>-->
        </nav>

        <section class="block-group">
            <div class="block" style="width: 25%;">
                <h3>
                    Licht/Sound
                    <span v-if="simulation.globals.effects > 0">(aktiv)</span>
                </h3>
                <button class="danger" :disabled="simulation.globals.effects <= 0" @click="disableEffects">OT</button>
                <button class="danger" :disabled="simulation.globals.effects > 0" @click="enableEffects">IT</button>
            </div>

            <div class="block" style="width: 25%;">
            </div>
        </section>

        <section class="block-group">
            <div class="block" style="width: 33.33%;">
                <h3>Basis</h3>
                <p>
                    <button :disabled="!simulation.globals.silentRunning && !simulation.globals.lockdown"
                            @click="setBaseNormal">
                        Normalbetrieb
                    </button>
                    <button :disabled="!!simulation.globals.silentRunning" @click="setBaseSilentRunning">
                        Silent Law
                    </button>
                    <button :disabled="!!simulation.globals.lockdown" @click="setBaseLockdown">
                        Lockdown
                    </button>
                </p>
                <ul>
                    <li>
                        Strom: {{ Math.round(simulation.stateMachines.base.powerSatisfaction * 100) }}%
                    </li>
                    <li>
                        Trinkwasser: {{ Math.round(simulation.stateMachines.base.drinkingWaterSatisfaction * 100) }}%
                    </li>
                </ul>
            </div>

            <div class="block" style="width: 33.33%;">
                <h3>Tarnkern</h3>
                <p>
                    <button class="danger" :disabled="simulation.globals.camouflage <= 0" @click="disableCamouflage">
                        Ausschalten
                    </button>
                    <button class="danger" :disabled="simulation.globals.camouflage > 0" @click="enableCamouflage">
                        Einschalten
                    </button>
                </p>
                <ul>
                    <li v-if="simulation.globals.lockdown <= 0">
                        Energie: {{ Math.round(simulation.stateMachines.core.energySatisfaction * 100) }}%
                    </li>
                    <li>
                        Naniten: {{ Math.round((simulation.stateMachines.core.nanites / simulation.stateMachines.core.nanitesCapacity) * 100)}}%
                    </li>
                    <li v-if="simulation.globals.camouflage">
                        Abschaltung {{ moment().to(moment().add(simulation.stateMachines.core.nanites, 'seconds')) }}
                    </li>
                    <li v-if="simulation.globals.camouflage">
                        Nächste Änderung {{ moment().to(moment().add(simulation.stateMachines.core.nextEnergyChange, 'seconds'))
                        }}
                    </li>
                </ul>
            </div>

            <div class="block" style="width: 33.33%;">
                <h3>Reaktor</h3>
                <ul>
                    <li>
                        Hitze: {{ Math.round(simulation.stateMachines.reactor.heat) }}°C
                    </li>
                    <li>
                        Produzierte Energie: {{ Math.round(simulation.stateMachines.reactor.energy) }}
                    </li>
                    <li>
                        Verschwendete Energie: {{ Math.round(simulation.stateMachines.reactor.energyWasted) }}
                    </li>
                </ul>
            </div>
        </section>
    </section>
</template>

<script>
    import {post} from '../fetch';
    import moment from 'moment';

    const BACKEND_URL = process.env.RESISTOPIA_BACKEND_URL;

    export default {
        name: 'dashboard',
        data() {
            return {
                moment,
            };
        },
        props: {
            simulation: {
                required: true,
            },
        },
        methods: {
            enableEffects() {
                post(BACKEND_URL + '/api/v1/globals', {effects: 1})
                    .then(response => {
                        this.refresh();
                    });
            },
            disableEffects() {
                if (!confirm('Licht- und Soundsteuerung ausschalten?')) {
                    return;
                }

                post(BACKEND_URL + '/api/v1/globals', {effects: 0})
                    .then(response => {
                        this.refresh();
                    });
            },
            enableLockdown() {
                if (!confirm('Lockdown erzwingen?')) {
                    return;
                }

                post(BACKEND_URL + '/api/v1/globals', {lockdown: 1})
                    .then(response => {
                        this.refresh();
                    });
            },
            disableLockdown() {
                if (!confirm('Lockdown aufheben?')) {
                    return;
                }

                post(BACKEND_URL + '/api/v1/globals', {lockdown: 0})
                    .then(response => {
                        this.refresh();
                    });
            },
            enableCamouflage() {
                if (!confirm('Tarnkern einschalten?')) {
                    return;
                }

                post(BACKEND_URL + '/api/v1/globals', {camouflage: 1})
                    .then(response => {
                        this.refresh();
                    });
            },
            disableCamouflage() {
                if (!confirm('Tarnkern ausschalten?')) {
                    return;
                }

                post(BACKEND_URL + '/api/v1/globals', {camouflage: 0})
                    .then(response => {
                        this.refresh();
                    });
            },
            setBaseNormal() {
                if (!confirm('Basis in den Normalbetrieb überführen?\nTarnkern einschalten wäre eine gute Idee.')) {
                    return;
                }

                post(BACKEND_URL + '/api/v1/globals', {silentRunning: 0, lockdown: 0})
                    .then(response => {
                        this.refresh();
                    });
            },
            setBaseSilentRunning() {
                if (!confirm('Basis in Silent Law überführen?')) {
                    return;
                }

                post(BACKEND_URL + '/api/v1/globals', {silentRunning: 1, lockdown: 0})
                    .then(response => {
                        this.refresh();
                    });
            },
            setBaseLockdown() {
                if (!confirm('Basis in den Lockdown versetzen?\nTarnkern kann dann (sinnvoll) abgeschaltet werden.')) {
                    return;
                }

                post(BACKEND_URL + '/api/v1/globals', {silentRunning: 0, lockdown: 1})
                    .then(response => {
                        this.refresh();
                    });
            },
            refresh() {
                this.$emit('refresh');
            },
        },
    };
</script>
