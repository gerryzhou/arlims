alter table test
  add constraint ck_test_testdatajson_isjson check (test_data_json is json format json strict);

alter table test
  add constraint ck_test_stagestatusjson_isjson check (stage_statuses_json is json format json strict);

alter table lab_group_test_type
  add constraint ck_lgrptstt_tstoptsjson_isjson check (test_configuration_json is json format json strict);

alter table data_change
  add constraint ck_dtachg_objmd_isjson check (object_context_metadata_json is json format json strict);
alter table data_change
  add constraint ck_dtachg_objfromval_isjson check (object_from_value_json is json format json strict);
alter table data_change
  add constraint ck_dtachg_objtoval_isjson check (object_to_value_json is json format json strict);
