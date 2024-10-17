import ControlBar from '@/components/ControlBar.vue';
import ENS from '@/components/ENS.vue';
import ExplanationBar from '@/components/ExplanationBar.vue';
import { mount } from '@vue/test-utils';
import { ElCard } from 'element-plus';
import { VNetworkGraph } from 'v-network-graph';

jest.mock('@/state/use-ens', () => {
    const mockUseENS = {
        nodes: { value: {} },
        layouts: { value: {} },
        selectedNodes: { value: ['p1', 't2'] },
        selectedPlaces: { value: [] },
        selectedTransitions: { value: [] },
        selectedFlowRelations: { value: [] },
        markedPlacePositions: { value: {} },
        ens: { value: {} },
        addPlace: jest.fn(),
        addTransition: jest.fn(),
        removeSelectedNodes: jest.fn(),
        addFlowRelation: jest.fn(),
        removeSelectedFlowRelations: jest.fn(),
        toggleTokenForSelectedPlaces: jest.fn(),
        loadENS: jest.fn(),
    };
    return {
        useENS: jest.fn(() => mockUseENS)
    };
});

jest.mock('@/state/use-vnet', () => ({
    useGraph: jest.fn(),
    configs: {},
    eventHandlers: {},
    layers: {},
}));

describe('ENS.vue', () => {
    it('renders correctly', () => {
        // given
        const wrapper = mount(ENS, {
            global: {
                components: {
                    ControlBar,
                    ExplanationBar,
                    ElCard,
                    VNetworkGraph,
                },
            },
        });

        // then
        expect(wrapper.exists()).toBe(true);
    });

    it('renders ControlBar and ExplanationBar components', () => {
        // given
        const wrapper = mount(ENS, {
            global: {
                components: {
                    ControlBar,
                    ExplanationBar,
                    ElCard,
                    VNetworkGraph,
                },
            },
        });

        // then
        expect(wrapper.findComponent(ControlBar).exists()).toBe(true);
        expect(wrapper.findComponent(ExplanationBar).exists()).toBe(true);
    });
});