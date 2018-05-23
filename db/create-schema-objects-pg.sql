/*
select 'drop table ' || tablename || ' cascade;' drop_command
from pg_tables
where schemaname = 'public';

*/

create table sample_pack (
  facts_sample_id int,
  facts_pack_id varchar(20),
  product_name varchar(50) not null,
  received date,
  received_by varchar(100),
  is_imported boolean,
  constraint pk_sample primary key (facts_sample_id, facts_pack_id)
);

create table sampling_test_units (
  id serial constraint pk_samplingtestunits primary key,
  description varchar(200) not null,
  standard_priority int -- standard choice iff priority is non-null
);

create table medium_type (
  code varchar(20) constraint pk_medtype primary key,
  description varchar(200) not null
);

create table medium_batch (
  id varchar(20) constraint pk_medbatch primary key,
  med_type varchar(20) not null constraint fk_medbatch_medtype references medium_type,
  expiration_date date not null
);

create table incubator (
  id varchar(20) constraint pk_incubator primary key,
  description varchar(50)
);

create table water_bath (
  id varchar(20) constraint pk_waterbath primary key,
  description varchar(50)
);

create table balance (
  id varchar(20) constraint pk_balance primary key,
  description varchar(50)
);

create table jar (
  id varchar(20) constraint pk_jar primary key,
  description varchar(50)
);

create table bag (
  id varchar(20) constraint pk_bag primary key,
  description varchar(50)
);

create table system_utensil (
  id varchar(20) constraint pk_utensil primary key,
  description varchar(50)
);

create table collector (
  id varchar(20) constraint pk_collector primary key,
  description varchar(50)
);

create table vidas (
  id varchar(20) constraint pk_vidas primary key,
  description varchar(50)
);

create table vidas_kit (
  id varchar(20) constraint pk_vidaskit primary key,
  description varchar(50)
);

create table analyst (
  id varchar(10) constraint pk_analyst primary key,
  name varchar(60) not null,
  email varchar(150)
);

create table sample_pack_assignment (
  sample_id int,
  pack_id varchar(20),
  analyst_id varchar(10) constraint fk_sampleassignment_analyst references analyst,
  constraint pk_sampleassignment primary key(sample_id, pack_id, analyst_id),
  constraint fk_sampleassignment_samplepack foreign key (sample_id, pack_id) references sample_pack
);

create table sample_labeling_attachment_type (
  code varchar(5) constraint pk_samplelabelingatt primary key,
  text varchar(30) not null
);

create table reserve_sample_disposition (
  code varchar(10) constraint pk_reservesampledisp primary key,
  text varchar(200) not null
);

create table imp_sal_test (
  sample_id int,
  pack_id varchar(20),

  description_matches_cr boolean,

  sample_labeling_attachment_type varchar(5)
    constraint fk_impsaltest_samplelabelingatt references sample_labeling_attachment_type,

  container_matches_cr boolean,
  container_matches_cr_signed timestamp,
  container_matches_cr_signed_by varchar(10)
    constraint fk_impsaltest_contmcrsb references analyst,

  code_matches_cr boolean,
  code_matching_notes varchar(200),
  code_matches_cr_signed timestamp,
  code_matches_cr_signed_by varchar(10)
    constraint fk_impsaltest_codemcrsb references analyst,

  sampling_test_units_id int
    constraint fk_impsaltest_samplingtestunits references sampling_test_units,

  balance_id varchar(20)
    constraint fk_impsaltest_balance references balance,

  blender_jar_id varchar(20)
    constraint fk_impsaltest_jar references jar,

  bag_id varchar(20)
    constraint fk_impsaltest_bag references bag,

  spike_analyzed boolean,
  spike_pos_plate_count int
    constraint ck_spikeposcount_nonneg check (spike_pos_plate_count >= 0),
  spike_neg_plate_count int
    constraint ck_spikenegcount_nonneg check (spike_neg_plate_count >= 0),

  preenrich_med_batch_id varchar(20)
    constraint fk_impsaltest_medbatch_preenrich references medium_batch,
  preenrich_incubator_id varchar(20)
    constraint fk_impsaltest_incubator_preenrich references incubator,
  preenrich_pos_control_growth boolean,
  preenrich_med_control_growth boolean,
  preenrich_signed timestamp,
  preenrich_signed_by varchar(10)
    constraint fk_impsaltest_analyst_preenrich references analyst,

  rv_batch_id varchar(20)
    constraint fk_impsaltest_medbatch_rv references medium_batch,

  tt_batch_id varchar(20)
    constraint fk_impsaltest_medbatch_tt references medium_batch
    constraint ck_ttbatch_provided check (
      all_completed_signed is null or tt_batch_id is not null
    ),
  tt_bg varchar(20),   -- TODO: what is this? (Determine if more structure is needed for these.)
  tt_l2ki varchar(20), --       "
  rvtt_water_bath_id varchar(20)
    constraint fk_impsaltest_waterbath_rv references water_bath
    constraint ck_rvttwaterbath_provided check (
      all_completed_signed is null or rvtt_water_bath_id is not null
    ),
  rvtt_signed timestamp,
  rvtt_signed_by varchar(10)
    constraint fk_impsaltest_analyst_rv references analyst,

  m_broth_batch_id varchar(20)
    constraint fk_impsaltest_medbatch_mbroth references medium_batch,
  m_broth_water_bath_id varchar(20)
    constraint fk_impsaltest_waterbath_mbroth references water_bath,
  m_broth_signed timestamp,
  m_broth_signed_by varchar(10)
    constraint fk_impsaltest_analyst_mbroth references analyst,

  vidas_composite_1_pos boolean,
  vidas_composite_2_pos boolean,
  vidas_instrument varchar(20)
    constraint fk_impsaltest_vidas references vidas,
  vidas_kit varchar(20)
    constraint fk_impsaltest_vidaskit references vidas_kit,
  vidas_kit_2 varchar(20)
    constraint fk_impsaltest_vidaskit2 references vidas_kit,
  vidas_pos_control_pos boolean,
  vidas_med_control_pos boolean,
  vidas_spike_pos boolean,
  vidas_signed timestamp,
  vidas_signed_by varchar(10)
    constraint fk_impsaltest_analyst_vidas references analyst,

  system_controls_pos_control_growth boolean,
  system_controls_med_control_growth boolean,

  system_controls_signed timestamp,
  system_controls_signed_by varchar(10)
    constraint fk_impsaltest_analyst_syscontrols references analyst,

  collectors_controls_pos_control_growth boolean,
  collectors_controls_med_control_growth boolean,

  collectors_controls_signed timestamp,
  collectors_controls_signed_by varchar(10)
    constraint fk_impsaltest_analyst_collcontrols references analyst,

  bacterial_controls_used boolean,
  bacterial_controls_signed timestamp,
  bacterial_controls_signed_by varchar(10)
    constraint fk_impsaltest_analyst_bactcontrols references analyst,

  result_pos_composites_count int
    constraint ck_resposcompscount_nonneg check (result_pos_composites_count >= 0),
  result_signed timestamp,
  result_signed_by varchar(10)
    constraint fk_impsaltest_analyst_result references analyst,

  reserve_sample_disposition varchar(10)
    constraint fk_impsaltest_reservesampledisp references reserve_sample_disposition,
  reserve_sample_destinations varchar(4000),
  reserve_sample_notes varchar(4000),

  all_completed_signed timestamp,
  all_completed_signed_by varchar(10)
    constraint fk_impsaltest_analyst_completed references analyst,


  constraint pk_impsaltest primary key (sample_id, pack_id),
  constraint fk_impsaltest_samplepack foreign key (sample_id, pack_id) references sample_pack,

  constraint ck_descriptionmatchescr_provided check (
    all_completed_signed is null or description_matches_cr is not null
  ),
  constraint ck_samplelabelingattachment_provided check (
    all_completed_signed is null or sample_labeling_attachment_type is not null
  ),
  constraint ck_containermatchescr_provided check (
    all_completed_signed is null or container_matches_cr is not null
  ),
  constraint ck_codematchescr_provided check (
    all_completed_signed is null or code_matches_cr is not null
  ),
  constraint ck_samplingtestunits_provided check (
    all_completed_signed is null or sampling_test_units_id is not null
  ),
  constraint ck_balance_provided check (
    all_completed_signed is null or balance_id is not null
  ),
  constraint ck_blenderjar_provided check (
    all_completed_signed is null or blender_jar_id is not null
  ),
  constraint ck_bag_provided check (
    all_completed_signed is null or bag_id is not null
  ),
  constraint ck_preenrichmedbatch_provided check (
    all_completed_signed is null or preenrich_med_batch_id is not null
  ),
  constraint ck_preenrichincubator_provided check (
    all_completed_signed is null or preenrich_incubator_id is not null
  ),
  constraint ck_preenrichposctrlgrowth_provided check (
    all_completed_signed is null or preenrich_pos_control_growth is not null
  ),
  constraint ck_preenrichmedctrlgrowth_provided check (
    all_completed_signed is null or preenrich_med_control_growth is not null
  ),
  constraint ck_rvbatch_provided check (
    all_completed_signed is null or rv_batch_id is not null
  ),
  constraint ck_spikeanalyzed_provided check (
    all_completed_signed is null or spike_analyzed is not null
  ),
  constraint ck_spikecounts_whenspiking check (
    spike_analyzed or
    spike_pos_plate_count is null and spike_neg_plate_count is null
  ),
  constraint ck_spikecounts_provided check (
    all_completed_signed_by is null or (
      spike_analyzed is null or (not spike_analyzed) or
      spike_pos_plate_count is not null and spike_neg_plate_count is not null
    )
  ),
  constraint ck_mbrothbatch_provided check (
    all_completed_signed is null or m_broth_batch_id is not null
  ),
  constraint ck_mbrothwaterbath_provided check (
    all_completed_signed is null or m_broth_water_bath_id is not null
  ),
  constraint ck_vidascomposite1pos_provided check (
    all_completed_signed is null or vidas_composite_1_pos is not null
  ),
  constraint vidascomposite2pos_only_additional check (
    vidas_composite_2_pos is null or vidas_composite_1_pos is not null
  ),
  constraint ck_vidasinstrument_provided check (
    all_completed_signed is null or vidas_instrument is not null
  ),
  constraint ck_vidaskit_provided check (
    all_completed_signed is null or vidas_kit is not null
  ),
  constraint ck_vidaskit2_only_additional check (
    vidas_kit_2 is null or vidas_kit is not null
  ),
  constraint ck_vidasposctrlpos_provided check (
    all_completed_signed is null or vidas_pos_control_pos is not null
  ),
  constraint ck_vidasmedctrlpos_provided check (
    all_completed_signed is null or vidas_med_control_pos is not null
  ),
  constraint ck_vidasspikepos_provided check (
    all_completed_signed is null or (
      spike_analyzed is null or (not spike_analyzed) or
      vidas_spike_pos is not null
    )
  ),
  constraint ck_sysctrlposctrlgrowth_provided check (
    all_completed_signed is null or system_controls_pos_control_growth is not null
  ),
  constraint ck_sysctrlmedctrlgrowth_provided check (
    all_completed_signed is null or system_controls_med_control_growth is not null
  ),
  constraint ck_collctrlposctrlgrowth_provided check (
    all_completed_signed is null or collectors_controls_pos_control_growth is not null
  ),
  constraint ck_collctrlmedctrlgrowth_provided check (
    all_completed_signed is null or collectors_controls_med_control_growth is not null
  ),
  constraint ck_bacterialctrlsused_provided check (
    all_completed_signed is null or bacterial_controls_used is not null
  ),
  constraint ck_resultposcompscount_provided check (
    all_completed_signed is null or result_pos_composites_count is not null
  ),
  constraint ck_reservesampledisp_provided check (
    all_completed_signed is null or reserve_sample_disposition is not null
  ),
  constraint ck_reservesampledests_provided check (
    all_completed_signed is null or
    reserve_sample_destinations is not null or
    coalesce(reserve_sample_disposition,'_') <> 'SENT'
  ),
  constraint ck_reservesamplenotes_provided check (
    all_completed_signed is null or
    reserve_sample_notes is not null or
    coalesce(reserve_sample_disposition,'_') <> 'OTHER'
  ),

  -- Check that signable sections are signed iff timestamped.
  constraint ck_all_completed_signed_iff_timestamped check ((all_completed_signed is null) = (all_completed_signed_by is null)),
  constraint ck_containermatchescr_signed_iff_timestamped check ((container_matches_cr_signed is null) = (container_matches_cr_signed_by is null)),
  constraint ck_codematchescr_signed_iff_timestamped check ((code_matches_cr_signed is null) = (code_matches_cr_signed_by is null)),
  constraint ck_preenrich_signed_iff_timestamped check ((preenrich_signed is null) = (preenrich_signed_by is null)),
  constraint ck_rvtt_signed_iff_timestamped check ((rvtt_signed is null) = (rvtt_signed_by is null)),
  constraint ck_mbroth_signed_iff_timestamped check ((m_broth_signed is null) = (m_broth_signed_by is null)),
  constraint ck_vidas_signed_iff_timestamped check ((vidas_signed is null) = (vidas_signed_by is null)),
  constraint ck_syscontrols_signed_iff_timestamped check ((system_controls_signed is null) = (system_controls_signed_by is null)),
  constraint ck_collcontrols_signed_iff_timestamped check ((collectors_controls_signed is null) = (collectors_controls_signed_by is null)),
  constraint ck_bacterialcontrols_signed_iff_timestamped check ((bacterial_controls_signed is null) = (bacterial_controls_signed_by is null)),
  constraint ck_result_signed_iff_timestamped check ((result_signed is null) = (result_signed_by is null)),

  -- Check that if the record is signed as all completed, then each signable part is signed as completed.
  constraint ck_if_signed_all_completed_then_all_stages_signed_and_completed
    check (
      all_completed_signed is null or (
        container_matches_cr_signed is not null and
        code_matches_cr_signed is not null and
        preenrich_signed is not null and
        rvtt_signed is not null and
        m_broth_signed is not null and
        vidas_signed is not null and
        system_controls_signed is not null and
        collectors_controls_signed is not null and
        bacterial_controls_signed is not null and
        result_signed is not null
      )
    )
);

create table imp_sal_test_utensil_control (
  sample_id int,
  pack_id varchar(20),

  utensil_id varchar(20)
    constraint fk_impsaltestutensil_untensil references system_utensil,

  pos_control_growth boolean not null,
  med_control_growth boolean not null,

  constraint pk_impsaltestutensil primary key (sample_id, pack_id, utensil_id),
  constraint fk_impsaltestutensil_impsaltest foreign key (sample_id, pack_id) references imp_sal_test on delete cascade
);

create table imp_sal_test_collector_control (
  sample_id int,
  pack_id varchar(20),

  collector_id varchar(20) constraint fk_impsaltestcoll_coll references collector,

  pos_control_growth boolean not null,
  med_control_growth boolean not null,

  constraint pk_impsaltestcoll primary key (sample_id, pack_id, collector_id),
  constraint fk_impsaltestcoll_impsaltest foreign key (sample_id, pack_id) references imp_sal_test on delete cascade
);


