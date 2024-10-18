# petri-net-simulator
A web-based simulator for elementary nets.
Elementary nets are special [petri-nets](https://en.wikipedia.org/wiki/Petri_net), which are used to mathematically describe concurrent systems and modulate their behavior (please follow [this document](./docs/intro-en.md) for theoretical background).

The following clip shows simulating a [proudcer-consumer-problem with one token](http://petrinet.org/#ProducerConsumer):

![](./docs/assets/EN-producer-consumer.mp4)

Try it out at: [https://mish-mosh.gitlab.io/petri-net-simulator/](https://mish-mosh.gitlab.io/petri-net-simulator/)

## Features
- Add places, transitions, and arcs (flow relations) to create single-tokened elementary nets (edit mode)
- Simulate its firing process of your net. Once in simulation mode, you can click on any active (green) transition to make it fire
- Import/Export the data of your net
- Export a snapshot of your net as SVG

## Motivation
I built this simulator while enrolled in an advanced mathematics course at university, which focused on petri-nets and the modulation of networks and processes.

I recognized the need for a simulator to better understand the theory behind this topic and hope that others will benefit from it as well.

## Installation
1. Download the repo:
   ```
   git clone https://gitlab.com/mish-mosh/petri-net-simulator.git
   ```
2. Setup project:
   ```
   npm install
   ```

## Development
#### Lints and fixes files
```
npm run lint
```

#### Run tests
```
npm run test
```
