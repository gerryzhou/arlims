alter table lab_test
  add constraint ck_labtest_testdata_isjson check (data is json format json strict);

