/*
select 'drop table ' || table_name || ' cascade constraints;' drop_command
from user_tables
;

*/

create table sample_pack (
  facts_sample_id int,
  facts_pack_id varchar(20),
  product_name varchar(50) not null,
  received date,
  received_by varchar(100),
  is_imported char(1) not null constraint ck_samplepack_importedyn check(is_imported in ('Y','N')),
  constraint pk_sample primary key (facts_sample_id, facts_pack_id)
);

create table sampling_test_units (
  id int generated always as identity constraint pk_samplingtestunits primary key,
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

create table labeling_attachment_type (
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

  descr_matches_cr char(1)
    constraint ck_impsaltest_descrmcr check(descr_matches_cr in ('Y','N')),

  lbl_att_type varchar(5)
    constraint fk_impsaltest_samplelblatt references labeling_attachment_type,

  cont_matches_cr char(1)
    constraint ck_impsaltest_contmcryn check(cont_matches_cr in ('Y', 'N')),
  cont_matches_cr_signed timestamp,
  cont_matches_cr_signed_by varchar(10)
    constraint fk_impsaltest_contmcrsb references analyst,

  code_matches_cr char(1)
    constraint ck_impsaltest_codemcryn check(code_matches_cr in ('Y','N')),
  code_matching_notes varchar(200),
  code_matches_cr_signed timestamp,
  code_matches_cr_signed_by varchar(10)
    constraint fk_impsaltest_codemcrsb references analyst,

  sampling_test_units_id int
    constraint fk_impsaltest_samptestunits references sampling_test_units,

  balance_id varchar(20)
    constraint fk_impsaltest_balance references balance,

  blender_jar_id varchar(20)
    constraint fk_impsaltest_jar references jar,

  bag_id varchar(20)
    constraint fk_impsaltest_bag references bag,

  spike_analyzed char(1)
    constraint ck_impsaltest_spikeyn check(spike_analyzed in ('Y','N')),
  spike_pos_plate_count int
    constraint ck_spikeposcount_nonneg check (spike_pos_plate_count >= 0),
  spike_neg_plate_count int
    constraint ck_spikenegcount_nonneg check (spike_neg_plate_count >= 0),

  preenrich_med_batch_id varchar(20)
    constraint fk_impsaltest_medbatch_preenr references medium_batch,
  preenrich_incubator_id varchar(20)
    constraint fk_impsaltest_incubator_preenr references incubator,
  preenrich_pos_ctl_growth char(1)
    constraint ck_impsaltest_preenrposctlgryn check(preenrich_pos_ctl_growth in ('Y','N')),
  preenrich_med_ctl_growth char(1)
    constraint ck_impsaltest_preenrmedctlgryn check(preenrich_med_ctl_growth in ('Y','N')),
  preenrich_signed timestamp,
  preenrich_signed_by varchar(10)
    constraint fk_impsaltest_analyst_preenr references analyst,

  rv_batch_id varchar(20)
    constraint fk_impsaltest_medbatch_rv references medium_batch,
  tt_batch_id varchar(20)
    constraint fk_impsaltest_medbatch_tt references medium_batch,
  tt_bg varchar(20),   -- TODO: what is this? (Determine if more structure is needed for these.)
  tt_l2ki varchar(20), --       "
  rvtt_water_bath_id varchar(20)
    constraint fk_impsaltest_waterbath_rv references water_bath,
  rvtt_signed timestamp,
  rvtt_signed_by varchar(10)
    constraint fk_impsaltest_analyst_rvtt references analyst,

  m_broth_batch_id varchar(20)
    constraint fk_impsaltest_medbatch_mbroth references medium_batch,
  m_broth_water_bath_id varchar(20)
    constraint fk_impsaltest_waterbath_mbroth references water_bath,
  m_broth_signed timestamp,
  m_broth_signed_by varchar(10)
    constraint fk_impsaltest_analyst_mbroth references analyst,

  vidas_comp_1_res char(1)
    constraint ck_impsaltest_vdscomp1respn check(vidas_comp_1_res in ('+','-')),
  vidas_comp_2_res char(1)
    constraint ck_impsaltest_vdscomp2respn check(vidas_comp_2_res in ('+','-')),
  vidas_instrument varchar(20)
    constraint fk_impsaltest_vidas references vidas,
  vidas_kit varchar(20)
    constraint fk_impsaltest_vidaskit references vidas_kit,
  vidas_kit_2 varchar(20)
    constraint fk_impsaltest_vidaskit2 references vidas_kit,
  vidas_pos_ctl_res char(1)
    constraint ck_impsaltest_vdsposctlrespn check(vidas_pos_ctl_res in ('+','-')),
  vidas_med_ctl_res char(1)
    constraint ck_impsaltest_vdsmedctlrespn check(vidas_med_ctl_res in ('+','-')),
  vidas_spike_res char(1)
    constraint ck_impsaltest_vdsspkrespn check(vidas_spike_res in ('+','-')),
  vidas_signed timestamp,
  vidas_signed_by varchar(10)
    constraint fk_impsaltest_analyst_vidas references analyst,

  sys_ctls_pos_ctl_growth char(1)
    constraint ck_impsaltest_sysctrlsposgryn check(sys_ctls_pos_ctl_growth in ('Y','N')),
  sys_ctls_med_ctl_growth char(1)
    constraint ck_impsaltest_sysctrlsmedgryn check(sys_ctls_med_ctl_growth in ('Y','N')),
  sys_ctls_signed timestamp,
  sys_ctls_signed_by varchar(10)
    constraint fk_impsaltest_analyst_sysctls references analyst,

  coll_ctls_pos_ctl_growth char(1)
    constraint ck_impsaltest_collctrlsposgryn check(coll_ctls_pos_ctl_growth in ('Y','N')),
  coll_ctls_med_ctl_growth char(1)
    constraint ck_impsaltest_collctrlsmedgryn check(coll_ctls_med_ctl_growth in ('Y','N')),
  coll_ctls_signed timestamp,
  coll_ctls_signed_by varchar(10)
    constraint fk_impsaltest_analyst_collctls references analyst,

  bact_ctls_used char(1)
    constraint ck_impsaltest_bactctlsyn check(bact_ctls_used in ('Y','N')),
  bact_ctls_signed timestamp,
  bact_ctls_signed_by varchar(10)
    constraint fk_impsaltest_analyst_bactctls references analyst,

  res_pos_comps_count int
    constraint ck_impsaltest_respcompsnn check (res_pos_comps_count >= 0),
  res_signed timestamp,
  res_signed_by varchar(10)
    constraint fk_impsaltest_analyst_res references analyst,

  reserve_sample_disposition varchar(10)
    constraint fk_impsaltest_ressampdisp references reserve_sample_disposition,
  reserve_sample_destinations varchar(4000),
  reserve_sample_notes varchar(4000),

  all_completed_signed timestamp,
  all_completed_signed_by varchar(10)
    constraint fk_impsaltest_analyst_compl references analyst,

  constraint pk_impsaltest primary key (sample_id, pack_id),
  constraint fk_impsaltest_samplepack foreign key (sample_id, pack_id) references sample_pack,

  constraint ck_descrmatchescr_pres check (
    all_completed_signed is null or descr_matches_cr is not null
  ),
  constraint ck_lblatt_pres check (
    all_completed_signed is null or lbl_att_type is not null
  ),
  constraint ck_contmatchescr_pres check (
    all_completed_signed is null or cont_matches_cr is not null
  ),
  constraint ck_codematchescr_pres check (
    all_completed_signed is null or code_matches_cr is not null
  ),
  constraint ck_samplingtestunits_pres check (
    all_completed_signed is null or sampling_test_units_id is not null
  ),
  constraint ck_balance_pres check (
    all_completed_signed is null or balance_id is not null
  ),
  constraint ck_blenderjar_pres check (
    all_completed_signed is null or blender_jar_id is not null
  ),
  constraint ck_bag_pres check (
    all_completed_signed is null or bag_id is not null
  ),
  constraint ck_preenrmedbatch_pres check (
    all_completed_signed is null or preenrich_med_batch_id is not null
  ),
  constraint ck_preenrincubator_pres check (
    all_completed_signed is null or preenrich_incubator_id is not null
  ),
  constraint ck_preenrposctrlgrowth_pres check (
    all_completed_signed is null or preenrich_pos_ctl_growth is not null
  ),
  constraint ck_preenrmedctrlgrowth_pres check (
    all_completed_signed is null or preenrich_med_ctl_growth is not null
  ),
  constraint ck_rvbatch_pres check (
    all_completed_signed is null or rv_batch_id is not null
  ),
  constraint ck_ttbatch_pres check (
    all_completed_signed is null or tt_batch_id is not null
  ),
  constraint ck_rvttwaterbath_pres check (
    all_completed_signed is null or rvtt_water_bath_id is not null
  ),
  constraint ck_spikeanalyzed_pres check (
    all_completed_signed is null or spike_analyzed is not null
  ),
  constraint ck_spikecounts_whenspiking check (
    spike_analyzed = 'Y' or spike_pos_plate_count is null and spike_neg_plate_count is null
  ),
  constraint ck_spikecounts_pres check (
    all_completed_signed_by is null or (
      spike_analyzed is null or spike_analyzed = 'N' or
      spike_pos_plate_count is not null and spike_neg_plate_count is not null
    )
  ),
  constraint ck_mbrothbatch_pres check (
    all_completed_signed is null or m_broth_batch_id is not null
  ),
  constraint ck_mbrothwaterbath_pres check (
    all_completed_signed is null or m_broth_water_bath_id is not null
  ),
  constraint ck_vidascomp1res_pres check (
    all_completed_signed is null or vidas_comp_1_res is not null
  ),
  constraint vidascomp2res_only_additional check (
    vidas_comp_2_res is null or vidas_comp_1_res is not null
  ),
  constraint ck_vidasinstrument_pres check (
    all_completed_signed is null or vidas_instrument is not null
  ),
  constraint ck_vidaskit_pres check (
    all_completed_signed is null or vidas_kit is not null
  ),
  constraint ck_vidaskit2_only_additional check (
    vidas_kit_2 is null or vidas_kit is not null
  ),
  constraint ck_vidasposctrlpos_pres check (
    all_completed_signed is null or vidas_pos_ctl_res is not null
  ),
  constraint ck_vidasmedctrlpos_pres check (
    all_completed_signed is null or vidas_med_ctl_res is not null
  ),
  constraint ck_vidasspikepos_pres check (
    all_completed_signed is null or (
      spike_analyzed is null or spike_analyzed = 'N' or
      vidas_spike_res is not null
    )
  ),
  constraint ck_sysctrlposctrlgrowth_pres check (
    all_completed_signed is null or sys_ctls_pos_ctl_growth is not null
  ),
  constraint ck_sysctrlmedctrlgrowth_pres check (
    all_completed_signed is null or sys_ctls_med_ctl_growth is not null
  ),
  constraint ck_collctrlposctrlgrowth_pres check (
    all_completed_signed is null or coll_ctls_pos_ctl_growth is not null
  ),
  constraint ck_collctrlmedctrlgrowth_pres check (
    all_completed_signed is null or coll_ctls_med_ctl_growth is not null
  ),
  constraint ck_bacterialctrlsused_pres check (
    all_completed_signed is null or bact_ctls_used is not null
  ),
  constraint ck_resultposcompscount_pres check (
    all_completed_signed is null or res_pos_comps_count is not null
  ),
  constraint ck_reservesampledisp_pres check (
    all_completed_signed is null or reserve_sample_disposition is not null
  ),
  constraint ck_reservesampledests_pres check (
    all_completed_signed is null or
    reserve_sample_destinations is not null or
    coalesce(reserve_sample_disposition,'_') <> 'SENT'
  ),
  constraint ck_reservesamplenotes_pres check (
    all_completed_signed is null or
    reserve_sample_notes is not null or
    coalesce(reserve_sample_disposition,'_') <> 'OTHER'
  ),

  -- Check that signable sections are signed iff timestamped.
  constraint ck_allcompletedsigned_iff_ts check (nvl2(all_completed_signed,1,0) = nvl2(all_completed_signed_by,1,0)),
  constraint ck_contmatchescr_signed_iff_ts check (nvl2(cont_matches_cr_signed,1,0) = nvl2(cont_matches_cr_signed_by,1,0)),
  constraint ck_codematchescr_signed_iff_ts check (nvl2(code_matches_cr_signed,1,0) = nvl2(code_matches_cr_signed_by,1,0)),
  constraint ck_preenr_signed_iff_ts check (nvl2(preenrich_signed,1,0) = nvl2(preenrich_signed_by,1,0)),
  constraint ck_rvtt_signed_iff_ts check (nvl2(rvtt_signed,1,0) = nvl2(rvtt_signed_by,1,0)),
  constraint ck_mbroth_signed_iff_ts check (nvl2(m_broth_signed,1,0) = nvl2(m_broth_signed_by,1,0)),
  constraint ck_vidas_signed_iff_ts check (nvl2(vidas_signed,1,0) = nvl2(vidas_signed_by,1,0)),
  constraint ck_sysctls_signed_iff_ts check (nvl2(sys_ctls_signed,1,0) = nvl2(sys_ctls_signed_by,1,0)),
  constraint ck_collctls_signed_iff_ts check (nvl2(coll_ctls_signed,1,0) = nvl2(coll_ctls_signed_by,1,0)),
  constraint ck_bacterialctls_signed_iff_ts check (nvl2(bact_ctls_signed,1,0) = nvl2(bact_ctls_signed_by,1,0)),
  constraint ck_result_signed_iff_ts check (nvl2(res_signed,1,0) = nvl2(res_signed_by,1,0)),

  -- Check that if the record is signed as all completed, then each signable part is signed as completed.
  constraint ck_signed_then_parts_signed
    check (
      all_completed_signed is null or (
        cont_matches_cr_signed is not null and
        code_matches_cr_signed is not null and
        preenrich_signed is not null and
        rvtt_signed is not null and
        m_broth_signed is not null and
        vidas_signed is not null and
        sys_ctls_signed is not null and
        coll_ctls_signed is not null and
        bact_ctls_signed is not null and
        res_signed is not null
      )
    )
);

create table imp_sal_test_utensil_control (
  sample_id int,
  pack_id varchar(20),

  utensil_id varchar(20)
    constraint fk_impsaltestutctl_utensil references system_utensil,

  pos_ctl_growth char(1) not null
    constraint ck_impsaltestutctl_pctlgryn check(pos_ctl_growth in ('Y','N')),
  med_ctl_growth char(1) not null
    constraint ck_impsaltestutctl_mctlgryn check(med_ctl_growth in ('Y','N')),

  constraint pk_impsaltestutctl primary key (sample_id, pack_id, utensil_id),
  constraint fk_impsaltestutctl_impsaltest foreign key (sample_id, pack_id) references imp_sal_test on delete cascade
);

create table imp_sal_test_collector_control (
  sample_id int,
  pack_id varchar(20),

  collector_id varchar(20) constraint fk_impsaltestcctl_coll references collector,

  pos_ctl_growth char(1) not null
    constraint ck_impsaltestcctl_pctlgryn check(pos_ctl_growth in ('Y','N')),
  med_ctl_growth char(1) not null
    constraint ck_impsaltestcctl_mctlgryn check(med_ctl_growth in ('Y','N')),

  constraint pk_impsaltestcctl primary key (sample_id, pack_id, collector_id),
  constraint fk_impsaltestcctl_impsaltest foreign key (sample_id, pack_id) references imp_sal_test on delete cascade
);


