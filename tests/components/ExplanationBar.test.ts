import ExplanationBar from '@/components/ExplanationBar.vue';
import { mount } from '@vue/test-utils';
import { ElAlert } from 'element-plus';


jest.mock('@/simulation');

describe('ExplanationBar.vue', () => {
    it('renders correctly', () => {
        // given
        const wrapper = mount(ExplanationBar, {
            global: {
                components: {
                    ElAlert,
                },
            },
        });

        // then
        expect(wrapper.exists()).toBe(true);
    });
});