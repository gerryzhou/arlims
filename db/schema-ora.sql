alter table test
  add constraint ck_test_testdatajson_isjson check (test_data_json is json format json strict);

alter table test
  add constraint ck_test_stagestatusjson_isjson check (stage_statuses_json is json format json strict);

alter table lab_group_test_type
  add constraint ck_lgrptstt_tstoptsjson_isjson check (test_configuration_json is json format json strict);
