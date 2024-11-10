<script setup lang="ts">
import { dialogIsOpen, openDialog } from '@/state/use-info-dialog';
</script>

<template>
    <el-row>
        <el-col :span="23">
            <h1>A Petri-Net Simulator</h1>
        </el-col>
        <el-col :span="1">
            <h1>
                <el-button type="info" circle @click="openDialog" data-test="open-dialog-btn">
                    <el-icon>
                        <InfoFilled />
                    </el-icon>
                </el-button>
            </h1>
            <el-dialog v-model="dialogIsOpen" title="About Elementary Nets and the Simulator" width="30%">
                <span class="wrapped-text-with-hyphens">
                    <b>Elementary nets</b> are special <a href="https://en.wikipedia.org/wiki/Petri_net"
                        target="_blank">petri-nets</a>,
                    which are used to mathematcially describe concurrent systems and modulate thier behavior.
                    <br>
                    <br>
                    A net is a Tripel N = (S,T,F) where:
                    <ul>
                        <li>S is a finite set of places, which represent the state of a system;</li>
                        <li>T is a finite set of transitions, which represent events or actions that can occur in
                            the system;</li>
                        <li>F is a finite set of arcs connecting places and transitions, which represent the flow of
                            tokens between places and transitions.</li>
                    </ul>
                    A token is a discrete unit of information that can be placed in a place and moved through the net.
                    <br>
                    The movement of token between the places is called firing.
                    The firing process of elementary single-tokened nets includes the following steps:
                    <ol>
                        <li>Initialize the initial marking of the net by placing tokens in the appropriate places.
                        </li>
                        <li>Choose a transition that is enabled, meaning all its input places have at least one
                            token.</li>
                        <li>Fire the chosen transition by removing one token from each input place and placing one
                            token in each output place.</li>
                        <li>Repeat steps 2 and 3 until no more transitions are enabled.</li>
                    </ol>

                    <b>With this simulator you can:</b>
                    <ul>
                        <li>Add places, transitions, and arcs (flow relations) to create single-tokened elementary nets
                            (edit mode)</li>
                        <li>Simulate the firing process of your net. Once in simulation mode, you can click on any
                            active (green) transition to make it fire</li>
                        <li>Import/Export the data of your net</li>
                        <li>Export a snapshot of your net as SVG</li>
                    </ul>
                    Enjoy exploring the world of Petri nets with this simulator!
                </span>
            </el-dialog>
        </el-col>
    </el-row>
</template>

<style>
.wrapped-text-with-hyphens {
    overflow-wrap: break-word;
    word-wrap: break-word;
    -ms-word-break: break-all;
    word-break: break-word;
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;
}
</style>