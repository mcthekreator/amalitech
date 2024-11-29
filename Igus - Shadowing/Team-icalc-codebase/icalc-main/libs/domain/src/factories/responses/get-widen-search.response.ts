/* eslint-disable @typescript-eslint/naming-convention */
import type { NestedPartial } from 'merge-partially';
import { mergePartially } from 'merge-partially';

interface GetWidenSearchResponse {
  query: string;
  sort: string;
  query_explained: string;
  sort_explained: string;
  scroll_id: null;
  scroll_timeout: null;
  query_syntax_ok: boolean;
  include_archived: boolean;
  include_deleted: boolean;
  facets: null;
  item_type: string;
  total_count: number;
  offset: number;
  limit: number;
  items: object[];
}

const getWidenSearchResponse: GetWidenSearchResponse = {
  query: 'productid:(MAT0177743)',
  sort: '-created_date',
  query_explained: 'Product ID-Article Number: MAT0177743',
  sort_explained: 'Created date (descending)',
  scroll_id: null,
  scroll_timeout: null,
  query_syntax_ok: true,
  include_archived: false,
  include_deleted: false,
  facets: null,
  item_type: 'asset',
  total_count: 1,
  offset: 0,
  limit: 10,
  items: [
    {
      id: '2405adb8-fe72-4bec-a47e-0ef3e27fd0b7',
      external_id: 'zofltmp3ft',
      filename: 'RCA_PROD_MAT0177743_low_quality.png',
      created_date: '2023-03-03T12:29:11Z',
      last_update_date: '2023-03-03T13:10:39Z',
      file_upload_date: '2023-03-03T12:29:11Z',
      deleted_date: null,
      released_and_not_expired: true,
      asset_properties: null,
      file_properties: null,
      metadata: {
        fields: {
          assettype: ['Technical drawing'],
          description: [],
          flipleft: [],
          flipright: [],
          height: ['620'],
          pINAssignment: [],
          productid: ['MAT0177743'],
          scaleX: [],
          scaleY: [],
          suitable: ['Web'],
          titleTag: [],
          width: ['958'],
          xmediaID: [],
        },
      },
      metadata_info: null,
      security: null,
      status: null,
      thumbnails: null,
      embeds: {
        '': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=1920&h=480&position=s&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="1920" height="480" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=1920&h=480&position=s&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=1920&h=480&position=s&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        '1040*570(free)': {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=1040&h=570&position=c&color=ffffff00&quality=80&u=jxmatw',
          html: '<img width="1040" height="570" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=1040&h=570&position=c&color=ffffff00&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=1040&h=570&position=c&color=ffffff00&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        '1050*700': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=1050&h=700&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="1050" height="700" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=1050&h=700&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=1050&h=700&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        '1080p': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=1920&h=1080&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="1920" height="1080" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=1920&h=1080&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=1920&h=1080&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        '1080x499': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=1080&h=499&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="1080" height="499" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=1080&h=499&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=1080&h=499&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        '1140*806': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=1140&h=806&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="1140" height="806" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=1140&h=806&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=1140&h=806&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        '2340*1170(free)': {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=2340&h=1170&position=c&color=ffffff00&quality=80&u=jxmatw',
          html: '<img width="2340" height="1170" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=2340&h=1170&position=c&color=ffffff00&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=2340&h=1170&position=c&color=ffffff00&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        '2485x2481': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=2485&h=2481&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="2485" height="2481" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=2485&h=2481&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=2485&h=2481&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        '300*300': {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=300&h=300&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="300" height="300" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=300&h=300&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=300&h=300&position=c&color=ffffffff&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        '350*230': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=350&h=230&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="350" height="230" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=350&h=230&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=350&h=230&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        '370*170(free)': {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=370&h=170&position=c&color=ffffff00&quality=80&u=jxmatw',
          html: '<img width="370" height="170" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=370&h=170&position=c&color=ffffff00&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=370&h=170&position=c&color=ffffff00&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        '458*370': {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=458&h=370&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="458" height="370" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=458&h=370&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=458&h=370&position=c&color=ffffffff&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        '4875*3780': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=4875&h=3780&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="4875" height="3780" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=4875&h=3780&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=4875&h=3780&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        '552*350': {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=552&h=350&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="552" height="350" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=552&h=350&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=552&h=350&position=c&color=ffffffff&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        '552*370': {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=552&h=370&keep=c&crop=yes&color=ffffff00&quality=80&u=jxmatw',
          html: '<img width="552" height="370" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=552&h=370&keep=c&crop=yes&color=ffffff00&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=552&h=370&keep=c&crop=yes&color=ffffff00&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        '570px*381px_frei': {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=570&h=381&position=c&color=ffffff00&quality=80&u=jxmatw',
          html: '<img width="570" height="381" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=570&h=381&position=c&color=ffffff00&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=570&h=381&position=c&color=ffffff00&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        '640px-landscape': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=640&keep=c&crop=yes&color=cccccc&quality=80&u=jxmatw',
          html: '<img width="640" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=640&keep=c&crop=yes&color=cccccc&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=640&keep=c&crop=yes&color=cccccc&quality=80&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        '640px-portrait': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?h=640&keep=c&crop=yes&color=cccccc&quality=80&u=jxmatw',
          html: '<img height="640" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?h=640&keep=c&crop=yes&color=cccccc&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?h=640&keep=c&crop=yes&color=cccccc&quality=80&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        '668*512': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=668&h=512&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="668" height="512" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=668&h=512&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=668&h=512&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        '740*370(free)': {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=740&h=370&position=c&color=ffffff00&quality=80&u=jxmatw',
          html: '<img width="740" height="370" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=740&h=370&position=c&color=ffffff00&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=740&h=370&position=c&color=ffffff00&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        CF77_UL_D: {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=10000&h=2048&keep=c&crop=yes&color=ffffffff&quality=80&r=90&u=jxmatw',
          html: '<img width="10000" height="2048" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=10000&h=2048&keep=c&crop=yes&color=ffffffff&quality=80&r=90&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=10000&h=2048&keep=c&crop=yes&color=ffffffff&quality=80&r=90&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        'CF_GEN_CF29.D_high_end_EN_512.png': {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=512&h=286&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="512" height="286" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=512&h=286&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=512&h=286&position=c&color=ffffffff&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        'COU-AR-K-080-100-25-22-B-AAAA_Gedreht': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=2048&h=1605&position=c&color=ffffffff&quality=80&r=270&u=jxmatw',
          html: '<img width="2048" height="1605" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=2048&h=1605&position=c&color=ffffffff&quality=80&r=270&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=2048&h=1605&position=c&color=ffffffff&quality=80&r=270&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        'COU-AR-K-080-100-25-22-B-AAAA_Gedreht_570x300': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=570&h=300&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="570" height="300" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=570&h=300&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=570&h=300&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        CP_interactive_catalogue: {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=540&position=nw&color=ffffffff&quality=100&u=jxmatw',
          html: '<img width="540" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=540&position=nw&color=ffffffff&quality=100&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=540&position=nw&color=ffffffff&quality=100&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        'E-commerce': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=2048&h=1078&keep=c&crop=yes&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="2048" height="1078" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=2048&h=1078&keep=c&crop=yes&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=2048&h=1078&keep=c&crop=yes&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        Hubspot_350width: {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=350&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="350" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=350&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=350&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        Hubspot_700width: {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=700&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="700" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=700&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=700&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        'JPEG-120x90px,thumbnail': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=120&h=90&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="120" height="90" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=120&h=90&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=120&h=90&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        'Presse700*550': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=700&h=550&keep=c&crop=yes&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="700" height="550" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=700&h=550&keep=c&crop=yes&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=700&h=550&keep=c&crop=yes&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        'Salesforce80*120': {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=80&h=120&keep=c&crop=yes&color=ffffff00&quality=80&u=jxmatw',
          html: '<img width="80" height="120" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=80&h=120&keep=c&crop=yes&color=ffffff00&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=80&h=120&keep=c&crop=yes&color=ffffff00&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        'Sonnensystem320px*420px': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=320&h=412&keep=c&crop=yes&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="320" height="412" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=320&h=412&keep=c&crop=yes&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=320&h=412&keep=c&crop=yes&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        Test_MB: {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=1000&keep=c&crop=yes&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="1000" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=1000&keep=c&crop=yes&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=1000&keep=c&crop=yes&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        Test_PDF_Formular: {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=94&h=90&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="94" height="90" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=94&h=90&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=94&h=90&position=c&color=ffffffff&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        'Thesizeforthe"strainrelief"screen': {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=80&h=70&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="80" height="70" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=80&h=70&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=80&h=70&position=c&color=ffffffff&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        Webpage600X430: {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=600&h=430&keep=c&crop=yes&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="600" height="430" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=600&h=430&keep=c&crop=yes&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=600&h=430&keep=c&crop=yes&color=ffffffff&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        'Webpage:365x207': {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=365&h=207&position=c&color=ffffff00&quality=80&u=jxmatw',
          html: '<img width="365" height="207" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=365&h=207&position=c&color=ffffff00&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=365&h=207&position=c&color=ffffff00&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        'Webpage:562*477': {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=562&h=477&position=c&color=ffffff00&quality=80&u=jxmatw',
          html: '<img width="562" height="477" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=562&h=477&position=c&color=ffffff00&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=562&h=477&position=c&color=ffffff00&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        WitoHub_transparent350px: {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=350&position=c&color=ffffff00&quality=80&u=jxmatw',
          html: '<img width="350" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=350&position=c&color=ffffff00&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=350&position=c&color=ffffff00&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        WitoHub_transparent700px: {
          url: 'https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=700&position=c&color=ffffff00&quality=80&u=jxmatw',
          html: '<img width="700" alt="RCA_PROD_MAT0177743_low_quality.png" src="https://igus.widen.net/content/zofltmp3ft/png/RCA_PROD_MAT0177743_low_quality.png?w=700&position=c&color=ffffff00&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=700&position=c&color=ffffff00&quality=80&t.download=true&t.format=png&u=jxmatw&x.share=t',
          apps: [],
        },
        aeDrawing: {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=250&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="250" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=250&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=250&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        drylintapplication: {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=300&h=400&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="300" height="400" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=300&h=400&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=300&h=400&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        'echain-app-1024': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=1024&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="1024" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=1024&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=1024&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        'echain-app-128': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=128&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="128" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=128&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=128&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        'echain-app-256': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=256&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="256" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=256&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=256&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        'echain-app-512': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=512&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="512" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=512&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=512&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        'echain-app-64': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=64&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="64" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=64&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=64&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        'echain-expert-ae-drawing': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=350&keep=c&crop=yes&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="350" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=350&keep=c&crop=yes&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=350&keep=c&crop=yes&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        'echain-expert-ae-typeselection': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=130&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="130" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=130&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=130&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        'echain-expert-selection-screen': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=220&position=w&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="220" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=220&position=w&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=220&position=w&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        exp_thumbnail: {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=280&h=110&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="280" height="110" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=280&h=110&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=280&h=110&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        'https://igus.widen.net/view/thumbnail/xnb2yk3vw4/Komplettset-banner_1170_FR.jpg?crop=false&position=c&q=80&color=ffffffff&u=4pz0n8&w=1980&h=480&t.format=jpeg&t.download=true&x.share=t':
          {
            url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=1980&h=480&position=c&color=ffffffff&quality=80&u=jxmatw',
            html: '<img width="1980" height="480" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=1980&h=480&position=c&color=ffffffff&quality=80&u=jxmatw">',
            share:
              'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=1980&h=480&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
            apps: [],
          },
        iFAward: {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=2048&h=1536&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="2048" height="1536" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=2048&h=1536&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=2048&h=1536&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        iSales_80x120px: {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=80&h=120&keep=c&crop=yes&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="80" height="120" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=80&h=120&keep=c&crop=yes&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=80&h=120&keep=c&crop=yes&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        ideanotesTechnischeZeichnungTischfräse: {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        igubalresized: {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=270&h=180&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="270" height="180" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=270&h=180&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=270&h=180&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        original: {
          url: 'https://igus.widen.net/content/zofltmp3ft/original/RCA_PROD_MAT0177743_low_quality.png?u=jxmatw&download=true',
          html: '<a href="https://igus.widen.net/content/zofltmp3ft/original/RCA_PROD_MAT0177743_low_quality.png?u=jxmatw&download=true" target="_blank">RCA_PROD_MAT0177743_low_quality.png</a>',
          share:
            'https://igus.widen.net/content/zofltmp3ft/original/RCA_PROD_MAT0177743_low_quality.png?u=jxmatw&download=true&x.share=t',
          apps: [],
        },
        original_size: {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        readychainspeed: {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=2050&h=1300&position=c&color=ffffffff&quality=80&r=270&u=jxmatw',
          html: '<img width="2050" height="1300" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=2050&h=1300&position=c&color=ffffffff&quality=80&r=270&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=2050&h=1300&position=c&color=ffffffff&quality=80&r=270&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        templated: {
          url: 'https://embed.widencdn.net/img/igus/zofltmp3ft/{size}px@{scale}x/RCA_PROD_MAT0177743_low_quality.png?q={quality}&x.template=y',
          html: null,
          share: null,
          apps: [],
        },
        'test-preset': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=600&h=600&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="600" height="600" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=600&h=600&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=600&h=600&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
        'test-preset-2': {
          url: 'https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=64&h=32&position=c&color=ffffffff&quality=80&u=jxmatw',
          html: '<img width="64" height="32" alt="RCA_PROD_MAT0177743_low_quality.jpeg" src="https://igus.widen.net/content/zofltmp3ft/jpeg/RCA_PROD_MAT0177743_low_quality.jpeg?w=64&h=32&position=c&color=ffffffff&quality=80&u=jxmatw">',
          share:
            'https://igus.widen.net/view/thumbnail/zofltmp3ft/RCA_PROD_MAT0177743_low_quality.png?w=64&h=32&position=c&color=ffffffff&quality=80&t.download=true&t.format=jpeg&u=jxmatw&x.share=t',
          apps: [],
        },
      },
      expanded: {
        asset_properties: false,
        embeds: true,
        file_properties: false,
        metadata: true,
        metadata_info: false,
        metadata_vocabulary: false,
        security: false,
        thumbnails: false,
      },
      _links: {
        download:
          'https://orders-bb.us-east-1.widencdn.net/download-deferred/originals?asset_wrn=wrn%3Aassets%3Aasset%3A31019507%3Azofltmp3ft&actor=wrn%3Ausers%3Auser%3A31019507%3Ajxmatw&tracking=ewogICJkb19ub3RfdHJhY2siOiBmYWxzZSwKICAiYW5vbnltb3VzIjogZmFsc2UsCiAgInZpc2l0b3JfaWQiOiBudWxsLAogICJ1c2VyX3dybiI6ICJ3aWRlbjp1c2Vyczp1c2VyOklHVVNaOmp4bWF0dyIKfQ%3D%3D&custom_metadata=ewogICJhcHBfbmFtZSI6ICJsZW5zIiwKICAiaW50ZW5kZWRfdXNlX2NvZGUiOiBudWxsLAogICJpbnRlbmRlZF91c2VfdmFsdWUiOiBudWxsLAogICJpbnRlbmRlZF91c2VfZW1haWwiOiBudWxsLAogICJjb2xsZWN0aW9uX2lkIjogbnVsbCwKICAicG9ydGFsX2lkIjogbnVsbCwKICAiZGFtX29yZGVyX2lkIjogbnVsbAp9&Expires=1679965200&Signature=bv9eaE1fOyQbBARrEmACE-Hrxqs0LG~76QjMmxpuqtDtaN25BA8iETp4MGpP4zB80vV2XV2HnAGOzsFt13z~DWrGGKhuPBu92hd~lMhVRpb0Oc0GwPo4n26XayNWHWVH4Mc1K0WCsqkvdozFctOx63MZnqgrQD~d3zk5h7OcMGH~zVtwiXJdLU9LVn-4jNG5cZfN-9NmPbOtntMUMIiIy34NyGPbgdEx0NlYeBC7WxvKIQiu35xYT8JpbDvrCmvnapTeFbHLGw9G~eEz0VtfoMTQBzNbIhDQjF0AlKEfrgD1ghR1Kte89nXrLuNSVi7sW56Uiit0z2fSFtLCU19xpQ__&Key-Pair-Id=APKAJM7FVRD2EPOYUXBQ',
        self: 'https://api.widencollective.com/v2/assets/2405adb8-fe72-4bec-a47e-0ef3e27fd0b7',
        self_all:
          'https://api.widencollective.com/v2/assets/2405adb8-fe72-4bec-a47e-0ef3e27fd0b7?expand=asset_properties%2Cembeds%2Cfile_properties%2Cmetadata%2Cmetadata_info%2Cmetadata_vocabulary%2Csecurity%2Cthumbnails',
      },
    },
  ],
};

/**
 * createGetWidenSearchResponse creates an untyped widen search response
 *
 * @param override pass any needed overrides for the requested widen search response
 * @returns widen search response
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createGetWidenSearchResponse = (override?: NestedPartial<any>): GetWidenSearchResponse => {
  return mergePartially.deep(getWidenSearchResponse, override);
};
