import { describe, expect, it } from '@jest/globals';
import { ENS, FlowRelation, Place, Transition } from '@/domain';

describe('Place', () => {
    it('should create a Place with the given name and default hasToken value', () => {
        // given
        const name = 'P1';

        // when
        const place = new Place(name);

        // then
        expect(place.name).toBe(name);
        expect(place.shape).toBe('circle');
        expect(place.hasToken).toBe(false);
    });

    it('should create a Place with the given name and hasToken value', () => {
        // given
        const name = 'P2';
        const hasToken = true;

        // when
        const place = new Place(name, hasToken);

        // then
        expect(place.name).toBe(name);
        expect(place.shape).toBe('circle');
        expect(place.hasToken).toBe(hasToken);
    });
});

describe('Transition', () => {
    it('should create a Transition with the given name', () => {
        // given
        const name = 'T1';

        // when
        const transition = new Transition(name);

        // then
        expect(transition.name).toBe(name);
        expect(transition.shape).toBe('rect');
    });
});

describe('FlowRelation', () => {
    it('should create a FlowRelation with the given source and target', () => {
        // given
        const source = 'P1';
        const target = 'T1';

        // when
        const flowRelation = new FlowRelation(source, target);

        // then
        expect(flowRelation.source).toBe(source);
        expect(flowRelation.target).toBe(target);
    });

    it('should allow additional properties to be added to FlowRelation', () => {
        // given
        const source = 'P1';
        const target = 'T1';
        const additionalProperty = 'weight';
        const additionalValue = 5;

        // when
        const flowRelation = new FlowRelation(source, target);
        flowRelation[additionalProperty] = additionalValue;

        // then
        expect(flowRelation.source).toBe(source);
        expect(flowRelation.target).toBe(target);
        expect(flowRelation[additionalProperty]).toBe(additionalValue);
    });
});

describe('ENS', () => {
    describe('getMarkings', () => {
        it('should return the correct markings for the places with tokens', () => {
            // given
            const places = {
                P1: new Place('P1', true),
                P2: new Place('P2', false),
                P3: new Place('P3', true),
            };
            const transitions = {}; // Assuming transitions are not relevant for this test
            const flowRelations = {}; // Assuming flowRelations are not relevant for this test
            const ens = new ENS(places, transitions, flowRelations);

            // when
            const markings = ens.getMarkings();

            // then
            const expectedMarkings = {
                P1: places.P1,
                P3: places.P3,
            };
            expect(markings).toEqual(expectedMarkings);
        });
    });

    describe('getActiveTransitions', () => {
        it('should return the correct active transitions', () => {
            // given
            const transitions = {
                produce: new Transition("produce"),
                put: new Transition("put"),
                consume: new Transition("consume"),
                take: new Transition("take"),
            };
            const places = {
                p2: new Place("p2", false),
                p1: new Place("p1", true),
                buffer: new Place("buffer", true),
                c1: new Place("c1", false),
                c2: new Place("c2", true),
            };
            const flowRelations = {
                flowRelation1: new FlowRelation("p1", "produce",),
                flowRelation2: new FlowRelation("produce", "p2"),
                flowRelation3: new FlowRelation("p2", "put",),
                flowRelation4: new FlowRelation("put", "p1"),
                flowRelation5: new FlowRelation("c1", "consume"),
                flowRelation6: new FlowRelation("consume", "c2"),
                flowRelation7: new FlowRelation("c2", "take"),
                flowRelation8: new FlowRelation("take", "c1"),
                flowRelation9: new FlowRelation("put", "buffer"),
                flowRelation10: new FlowRelation("buffer", "take"),
            };

            const ens = new ENS(places, transitions, flowRelations);

            // when
            const activeTransitions = ens.getActiveTransitions();

            // then
            const expectedActiveTransitions = {
                take: transitions.take,
                produce: transitions.produce,
            };
            expect(activeTransitions).toEqual(expectedActiveTransitions);
        });
    });

    describe('transitionIsActive', () => {
        it('should return true if the transition is active', () => {
            // given
            const transitions = {
                produce: new Transition("produce"),
                put: new Transition("put"),
                consume: new Transition("consume"),
                take: new Transition("take"),
            };
            const places = {
                p2: new Place("p2", false),
                p1: new Place("p1", true),
                buffer: new Place("buffer", true),
                c1: new Place("c1", false),
                c2: new Place("c2", true),
            };
            const flowRelations = {
                flowRelation1: new FlowRelation("p1", "produce",),
                flowRelation2: new FlowRelation("produce", "p2"),
                flowRelation3: new FlowRelation("p2", "put",),
                flowRelation4: new FlowRelation("put", "p1"),
                flowRelation5: new FlowRelation("c1", "consume"),
                flowRelation6: new FlowRelation("consume", "c2"),
                flowRelation7: new FlowRelation("c2", "take"),
                flowRelation8: new FlowRelation("take", "c1"),
                flowRelation9: new FlowRelation("put", "buffer"),
                flowRelation10: new FlowRelation("buffer", "take"),
            };

            const ens = new ENS(places, transitions, flowRelations);

            // when
            const isActive = ens.transitionIsActive(transitions.take);

            // then
            expect(isActive).toBe(true);
        });

        it('should return false if the transition is not active', () => {
            // given
            const transitions = {
                produce: new Transition("produce"),
                put: new Transition("put"),
                consume: new Transition("consume"),
                take: new Transition("take"),
            };
            const places = {
                p2: new Place("p2", false),
                p1: new Place("p1", true),
                buffer: new Place("buffer", true),
                c1: new Place("c1", false),
                c2: new Place("c2", true),
            };
            const flowRelations = {
                flowRelation1: new FlowRelation("p1", "produce",),
                flowRelation2: new FlowRelation("produce", "p2"),
                flowRelation3: new FlowRelation("p2", "put",),
                flowRelation4: new FlowRelation("put", "p1"),
                flowRelation5: new FlowRelation("c1", "consume"),
                flowRelation6: new FlowRelation("consume", "c2"),
                flowRelation7: new FlowRelation("c2", "take"),
                flowRelation8: new FlowRelation("take", "c1"),
                flowRelation9: new FlowRelation("put", "buffer"),
                flowRelation10: new FlowRelation("buffer", "take"),
            };

            const ens = new ENS(places, transitions, flowRelations);

            // when
            const isActive = ens.transitionIsActive(transitions.consume);

            // then
            expect(isActive).toBe(false);
        });
    });

    describe('preTransition', () => {
        it('should return the correct places prior to the transition', () => {
            // given
            const transitions = {
                produce: new Transition("produce"),
                put: new Transition("put"),
                consume: new Transition("consume"),
                take: new Transition("take"),
            };
            const places = {
                p2: new Place("p2", false),
                p1: new Place("p1", true),
                buffer: new Place("buffer", true),
                c1: new Place("c1", false),
                c2: new Place("c2", true),
            };
            const flowRelations = {
                flowRelation1: new FlowRelation("p1", "produce",),
                flowRelation2: new FlowRelation("produce", "p2"),
                flowRelation3: new FlowRelation("p2", "put",),
                flowRelation4: new FlowRelation("put", "p1"),
                flowRelation5: new FlowRelation("c1", "consume"),
                flowRelation6: new FlowRelation("consume", "c2"),
                flowRelation7: new FlowRelation("c2", "take"),
                flowRelation8: new FlowRelation("take", "c1"),
                flowRelation9: new FlowRelation("put", "buffer"),
                flowRelation10: new FlowRelation("buffer", "take"),
            };

            const ens = new ENS(places, transitions, flowRelations);

            // when
            const preTransitionPlaces = ens.preTransition(transitions.take);

            // then
            const expectedPreTransitionPlaces = {
                buffer: places.buffer,
                c2: places.c2,
            };
            expect(preTransitionPlaces).toEqual(expectedPreTransitionPlaces);
        });

        it('should return an empty object if there are no places prior to the transition', () => {
            // given
            const places = {
                P1: new Place('P1', false),
            };
            const transitions = {
                T1: new Transition('T1'),
            };
            const flowRelations = {
                FR2: new FlowRelation('T1', 'P1'),
            };
            const ens = new ENS(places, transitions, flowRelations);

            // when
            const preTransitionPlaces = ens.preTransition(transitions.T1);

            // then
            expect(preTransitionPlaces).toEqual({});
        });
    });

    describe('postTransition', () => {
        it('should return the correct places after to the transition', () => {
            // given
            const transitions = {
                produce: new Transition("produce"),
                put: new Transition("put"),
                consume: new Transition("consume"),
                take: new Transition("take"),
            };
            const places = {
                p2: new Place("p2", false),
                p1: new Place("p1", true),
                buffer: new Place("buffer", true),
                c1: new Place("c1", false),
                c2: new Place("c2", true),
            };
            const flowRelations = {
                flowRelation1: new FlowRelation("p1", "produce",),
                flowRelation2: new FlowRelation("produce", "p2"),
                flowRelation3: new FlowRelation("p2", "put",),
                flowRelation4: new FlowRelation("put", "p1"),
                flowRelation5: new FlowRelation("c1", "consume"),
                flowRelation6: new FlowRelation("consume", "c2"),
                flowRelation7: new FlowRelation("c2", "take"),
                flowRelation8: new FlowRelation("take", "c1"),
                flowRelation9: new FlowRelation("put", "buffer"),
                flowRelation10: new FlowRelation("buffer", "take"),
            };

            const ens = new ENS(places, transitions, flowRelations);

            // when
            const postTransitionPlaces = ens.postTransition(transitions.take);

            // then
            const expectedPreTransitionPlaces = {
                c1: places.c1,
            };
            expect(postTransitionPlaces).toEqual(expectedPreTransitionPlaces);
        });

        it('should return an empty object if there are no places after to the transition', () => {
            // given
            const places = {
                P1: new Place('P1', false),
            };
            const transitions = {
                T1: new Transition('T1'),
            };
            const flowRelations = {
                FR2: new FlowRelation('P1', 'T1'),
            };
            const ens = new ENS(places, transitions, flowRelations);

            // when
            const postTransitionPlaces = ens.postTransition(transitions.T1);

            // then
            expect(postTransitionPlaces).toEqual({});
        });
    });

    describe('validate', () => {
        it('should throw an error if a flow relation has both source and target as transitions', () => {
            // given
            const places = {
                P1: new Place('P1', true),
            };
            const transitions = {
                T1: new Transition('T1'),
                T2: new Transition('T2'),
            };
            const flowRelations = {
                FR1: new FlowRelation('T1', 'T2'),
            };
            const ens = new ENS(places, transitions, flowRelations);

            // when / then
            expect(() => ens.validate()).toThrowError('Source and target of flow relation (T1, T2) cannot be both transitions.');
        });

        it('should throw an error if a flow relation has both source and target as places', () => {
            // given
            const places = {
                P1: new Place('P1', true),
                P2: new Place('P2', false),
            };
            const transitions = {
                T1: new Transition('T1'),
            };
            const flowRelations = {
                FR1: new FlowRelation('P1', 'P2'),
            };
            const ens = new ENS(places, transitions, flowRelations);

            // when / then
            expect(() => ens.validate()).toThrowError('Source and target of flow relation (P1, P2) cannot be both places.');
        });

        it('should throw an error if a transition has no pre-places', () => {
            // given
            const places = {
                P1: new Place('P1', true),
            };
            const transitions = {
                T1: new Transition('T1'),
            };
            const flowRelations = {
                FR1: new FlowRelation('T1', 'P1'),
            };
            const ens = new ENS(places, transitions, flowRelations);

            // when / then
            expect(() => ens.validate()).toThrowError('Transition "T1" must have at least one pre-place.');
        });

        it('should throw an error if a transition has no post-places', () => {
            // given
            const places = {
                P1: new Place('P1', true),
            };
            const transitions = {
                T1: new Transition('T1'),
            };
            const flowRelations = {
                FR1: new FlowRelation('P1', 'T1'),
            };
            const ens = new ENS(places, transitions, flowRelations);

            // when / then
            expect(() => ens.validate()).toThrowError('Transition "T1" must have at least one post-place.');
        });

        it('should throw an error if a place is both a pre-place and a post-place for a transition', () => {
            // given
            const places = {
                P1: new Place('P1', true),
            };
            const transitions = {
                T1: new Transition('T1'),
            };
            const flowRelations = {
                FR1: new FlowRelation('P1', 'T1'),
                FR2: new FlowRelation('T1', 'P1'),
            };
            const ens = new ENS(places, transitions, flowRelations);

            // when / then
            expect(() => ens.validate()).toThrowError('Place "P1" cannot be in be a pre-place as well as a post-place for transition "T1".');
        });

        it('should not throw an error for a valid configuration', () => {
            // given
            const places = {
                P1: new Place('P1', true),
                P2: new Place('P2', false),
            };
            const transitions = {
                T1: new Transition('T1'),
            };
            const flowRelations = {
                FR1: new FlowRelation('P1', 'T1'),
                FR2: new FlowRelation('T1', 'P2'),
            };
            const ens = new ENS(places, transitions, flowRelations);

            // when / then
            expect(() => ens.validate()).not.toThrow();
        });
    });
});