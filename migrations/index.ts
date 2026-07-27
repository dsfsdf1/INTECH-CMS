import * as migration_20260724_141210_initial from './20260724_141210_initial';
import * as migration_20260724_143145_automation_page_blocks from './20260724_143145_automation_page_blocks';
import * as migration_20260725_001000_page_seo_advanced from './20260725_001000_page_seo_advanced';
import * as migration_20260725_002000_seo_center from './20260725_002000_seo_center';

export const migrations = [
  {
    up: migration_20260724_141210_initial.up,
    down: migration_20260724_141210_initial.down,
    name: '20260724_141210_initial',
  },
  {
    up: migration_20260724_143145_automation_page_blocks.up,
    down: migration_20260724_143145_automation_page_blocks.down,
    name: '20260724_143145_automation_page_blocks'
  },
  {
    up: migration_20260725_001000_page_seo_advanced.up,
    down: migration_20260725_001000_page_seo_advanced.down,
    name: '20260725_001000_page_seo_advanced',
  },
  {
    up: migration_20260725_002000_seo_center.up,
    down: migration_20260725_002000_seo_center.down,
    name: '20260725_002000_seo_center',
  },
];
