import { mount } from '@vue/test-utils';
import HeaderComponent from '@/components/HeaderComponent.vue';
import { openDialog, dialogIsOpen } from '@/state/use-info-dialog';
import { ElButton, ElCol, ElDialog, ElIcon, ElRow } from 'element-plus';
import InfoFilled from '@element-plus/icons-vue';

jest.mock('@/state/use-info-dialog', () => ({
  openDialog: jest.fn(),
  dialogIsOpen: { value: false },
}));

describe('HeaderComponent.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(HeaderComponent, {
      global: {
        components: {
          ElButton,
          ElCol,
          ElDialog,
          ElIcon,
          ElRow,
          InfoFilled,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('renders the title correctly', () => {
    const wrapper = mount(HeaderComponent, {
      global: {
        components: {
          ElButton,
          ElCol,
          ElDialog,
          ElIcon,
          ElRow,
          InfoFilled,
        },
      },
    });

    expect(wrapper.find('h1').text()).toBe('A Petri-Net Simulator');
  });

  it('opens the dialog when the button is clicked', async () => {
    const wrapper = mount(HeaderComponent, {
      global: {
        components: {
          ElButton,
          ElCol,
          ElDialog,
          ElIcon,
          ElRow,
          InfoFilled,
        },
      },
    });

    const button = wrapper.find('[data-test="open-dialog-btn"]');
    await button.trigger('click');

    expect(openDialog).toHaveBeenCalled();
  });

  it('displays the dialog when dialogIsOpen is true', async () => {
    (dialogIsOpen as any).value = true;

    const wrapper = mount(HeaderComponent, {
      global: {
        components: {
          ElButton,
          ElCol,
          ElDialog,
          ElIcon,
          ElRow,
          InfoFilled,
        },
      },
    });

    await wrapper.vm.$nextTick();

    const dialog = wrapper.findComponent(ElDialog);
    expect(dialog.exists()).toBe(true);
  });
});