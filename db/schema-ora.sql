alter table lab_test
  add constraint ck_labtest_testdata_isjson check (test_data_json is json format json strict);

alter table lab_group_test_type
  add constraint ck_lgrptstt_tstopts_isjson check (test_options_json is json format json strict);

