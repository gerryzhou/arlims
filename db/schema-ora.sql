alter table test
  add constraint ck_test_testdatajson_isjson check (test_data_json is json format json strict);

alter table test
  add constraint ck_test_stagestatusjson_isjson check (stage_statuses_json is json format json strict);

alter table lab_group_test_type
  add constraint ck_lgrptstt_tstoptsjson_isjson check (test_configuration_json is json format json strict);

alter table audit_entry
  add constraint ck_audent_objmd_isjson check (object_context_metadata_json is json format json strict);
alter table audit_entry
  add constraint ck_audent_objfromval_isjson check (object_from_value_json is json format json strict);
alter table audit_entry
  add constraint ck_audent_objtoval_isjson check (object_to_value_json is json format json strict);

create index ix_tst_testdatajson on test(test_data_json) indextype is ctxsys.context parameters('sync (on commit)');

create or replace view test_v as
  select
    t.id test_id,
    t.op_id,
    tt.code type_code,
    tt.name type_name,
    tt.short_name type_short_name,
    t.created created,
    ce.short_name created_by_emp,
    t.last_saved last_saved,
    se.short_name last_saved_emp,
    (select count(*) from test_file tf where tf.test_id = t.id) attached_files_count,
    TO_CHAR(t.begin_date, 'YYYY-MM-DD') begin_date,
    t.note,
    t.stage_statuses_json,
    t.reviewed,
    re.short_name reviewed_by_emp,
    t.saved_to_facts,
    fe.short_name saved_to_facts_by_emp,
    t.test_data_json
  from test t
  join test_type tt on t.test_type_id = tt.id
  join employee ce on ce.id = t.created_by_emp_id
  join employee se on se.id = t.last_saved_by_emp_id
  left join employee re on re.id = t.reviewed_by_emp_id
  left join employee fe on fe.id = t.last_saved_by_emp_id
;
