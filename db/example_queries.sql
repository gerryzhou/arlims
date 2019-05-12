
-- Filter and extract objects and fields from json test data.
select
  test_data_json #> '{selEnrData}' as sel_enr,
  test_data_json #> '{preEnrData, bagId}' as bag,
  test_data_json #> '{preEnrData, balanceId}' as balance,
  test_data_json #> '{vidasData, testUnitDetections}' as vidas_detections
from test
where
  -- only include tests that have a Vidas positive.
  test_data_json @> '{"vidasData": {"testUnitDetections": [true]}}' and
  test_data_json #>> '{preEnrData, balanceId}' ~ 'ARL.*'
;

-- combined employee and lab group contents query (without helper views)
select
  e.*,
  -- test types registered in the employee's lab group
  (select jsonb_agg(to_jsonb(lgtt) - 'lab_group_id')
   from (
     select
        lgtt.lab_group_id,
        lgtt.test_configuration_json,
        lgtt.report_names_bar_sep,
        tt.id test_type_id,
        tt.code test_type_code,
        tt.name test_type_name,
        tt.short_name test_type_short_name,
        tt.description test_type_description
     from lab_group_test_type lgtt
     join test_type tt on lgtt.test_type_id = tt.id
   ) lgtt
   where lgtt.lab_group_id = e.lab_group_id
  ) lab_group_test_types,
  -- all employees of this employee's lab group
  (select jsonb_agg(to_jsonb(ur) - 'lab_group_id')
   from (
     select
        e.id employee_id,
        e.lab_group_id,
        e.facts_person_id,
        e.fda_email_account_name,
        e.short_name
        from employee e
   ) ur
   where ur.lab_group_id = e.lab_group_id
  ) lab_group_employees,
  -- all resources assigned to the employee's lab group
  (select jsonb_agg(to_jsonb(lgr) - 'lab_group_id')
   from (
      select distinct
         lgrg.lab_group_id,
         r.resource_type,
         r.code,
         r.description,
         r.resource_group
         from lab_group_resource_group lgrg
         join resource r on r.resource_group = lgrg.resource_group
   ) lgr
   where lgr.lab_group_id = e.lab_group_id
  ) lab_group_resources
from
-- employee / lab group info
(
  select
     e.id employee_id,
     e.lab_group_id,
     lg.name lab_group_name,
     lg.facts_org_name lab_group_facts_org_name,
     e.facts_person_id,
     e.fda_email_account_name,
     e.short_name,
     e.first_name,
     e.last_name,
     e.middle_name,
     -- the employee's assigned roles
     (select array_agg(r.name) from role r
      where exists(select 1 from employee_role er where er.emp_id = e.id)) roles
  from employee e
  join lab_group lg on e.lab_group_id = lg.id
) e
;


-- combined employee and lab group contents query, using helper views
select
   e.*,
   (select jsonb_agg(lgtt.json) from lab_group_test_type_jv lgtt
    where lgtt.lab_group_id = e.lab_group_id) lab_group_test_types,
   (select jsonb_agg(ur.json) from employee_reference_jv ur
    where ur.lab_group_id = e.lab_group_id) lab_group_employees,
   (select jsonb_agg(lgr.json)
    from lab_group_resource_jv lgr
    where lgr.lab_group_id = e.lab_group_id) lab_group_resources
from employee_v e
;

