import ControlBar from '@/components/ControlBar.vue';
import { toggleSimMode } from '@/simulation';
import { useENS } from '@/state/use-ens';
import { mount } from '@vue/test-utils';
import { ElButton, ElTabPane, ElTabs } from 'element-plus';



jest.mock('@/state/use-ens', () => {
  const mockUseENS = {
    nodes: { value: {} },
    layouts: { value: {} },
    selectedNodes: { value: ['p1', 't2'] },
    selectedPlaces: { value: [] },
    selectedTransitions: { value: [] },
    selectedFlowRelations: { value: {} },
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

jest.mock('@/state/use-vnet');
jest.mock('@/json-adapter');

jest.mock('@/simulation', () => ({
  simMode: false,
  toggleSimMode: jest.fn(),
}));

jest.mock('@/state/use-control-bar', () => ({
  activeTabName: 'places',
}));

describe('ControlBar.vue', () => {
  it('renders correctly', () => {
    // given
    const wrapper = mount(ControlBar, {
      global: {
        components: {
          ElButton,
          ElTabPane,
          ElTabs,
        },
      },
    });

    // then
    expect(wrapper.exists()).toBe(true);
  });

  it('toggles simulation mode when the button is clicked', async () => {
    // given
    const wrapper = mount(ControlBar, {
      global: {
        components: {
          ElButton,
          ElTabPane,
          ElTabs,
        },
      },
    });

    // when
    const toggleButton = wrapper.find('[data-test="toggle-sim-mode-btn"]');
    await toggleButton.trigger('click');

    // then
    expect(toggleSimMode).toHaveBeenCalled();
  });

  it('calls addPlace when the add place button is clicked', async () => {
    // given
    const wrapper = mount(ControlBar, {
      global: {
        components: {
          ElButton,
          ElTabPane,
          ElTabs,
        },
      },
    });

    // when
    const addPlaceButton = wrapper.find('[data-test="add-place-btn"]');
    await addPlaceButton.trigger('click');

    // then
    useENS().addPlace()
    expect(useENS().addPlace).toHaveBeenCalled();
  });

  it('calls removeSelectedNodes when the remove places button is clicked', async () => {
    // given
    const wrapper = mount(ControlBar, {
      global: {
        components: {
          ElButton,
          ElTabPane,
          ElTabs,
        },
      },
    });

    // when
    const removeNodesButton = wrapper.find('[data-test="remove-places-btn"]');
    await removeNodesButton.trigger('click');

    // then
    expect(useENS().removeSelectedNodes).toHaveBeenCalled();
  });

  it('calls addTransition when the add transition button is clicked', async () => {
    // given
    const wrapper = mount(ControlBar, {
      global: {
        components: {
          ElButton,
          ElTabPane,
          ElTabs,
        },
      },
    });

    // when
    const addTransitionButton = wrapper.find('[data-test="add-transition-btn"]');
    await addTransitionButton.trigger('click');

    // then
    expect(useENS().addTransition).toHaveBeenCalled();
  });

  it('calls removeSelectedNodes when the remove transitions button is clicked', async () => {
    // given
    const wrapper = mount(ControlBar, {
      global: {
        components: {
          ElButton,
          ElTabPane,
          ElTabs,
        },
      },
    });

    // when
    const removeNodesButton = wrapper.find('[data-test="remove-transitions-btn"]');
    await removeNodesButton.trigger('click');

    // then
    expect(useENS().removeSelectedNodes).toHaveBeenCalled();
  });

  it('calls addFlowRelation when the add flow relation button is clicked', async () => {
    // given
    const wrapper = mount(ControlBar, {
      global: {
        components: {
          ElButton,
          ElTabPane,
          ElTabs,
        },
      },
    });

    // when
    const addFlowRelationButton = wrapper.find('[data-test="add-flow-relation-btn"]');
    await addFlowRelationButton.trigger('click');

    // then
    expect(useENS().addFlowRelation).toHaveBeenCalled();
  });

  it('calls removeSelectedFlowRelations when the remove flow relations button is clicked', async () => {
    // given
    const wrapper = mount(ControlBar, {
      global: {
        components: {
          ElButton,
          ElTabPane,
          ElTabs,
        },
      },
    });

    // when
    const removeFlowRelationsButton = wrapper.find('[data-test="remove-flow-relations-btn"]');
    await removeFlowRelationsButton.trigger('click');

    // then
    expect(useENS().removeSelectedFlowRelations).toHaveBeenCalled();
  });
});