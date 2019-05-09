package gov.fda.nctr.arlims.data_access.test_data;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.RowMapper;

import gov.fda.nctr.arlims.models.dto.LabTestMetadata;
import gov.fda.nctr.arlims.models.dto.LabTestTypeCode;
import gov.fda.nctr.arlims.models.dto.SampleOp;
import gov.fda.nctr.arlims.models.dto.SampleOpTest;
import static java.util.Collections.singletonList;


public class TestVSampleOpTestRowMapper implements RowMapper<SampleOpTest>
{
    private boolean includeTestMetadataInSampleOp;

    public static final List<String> TESTV_SAMPLE_OP_TEST_MAPPED_COLS =
        Arrays.asList(
            "TEST_ID",
            "OP_ID",
            "SAMPLE_TRACKING_NUM",
            "SAMPLE_TRACKING_SUB_NUM",
            "PAC",
            "PRODUCT_NAME",
            "TYPE_CODE",
            "TYPE_NAME",
            "TYPE_SHORT_NAME",
            "CREATED",
            "CREATED_BY_EMP",
            "LAST_SAVED",
            "LAST_SAVED_BY_EMP",
            "ATTACHED_FILES_COUNT",
            "BEGIN_DATE",
            "NOTE",
            "STAGE_STATUSES_JSON",
            "REVIEWED",
            "REVIEWED_BY_EMP",
            "SAVED_TO_FACTS",
            "SAVED_TO_FACTS_BY_EMP",
            "LID",
            "PAF",
            "SUBJECT"
        );


    public TestVSampleOpTestRowMapper(boolean includeTestMetadataInSampleOp)
    {
        this.includeTestMetadataInSampleOp = includeTestMetadataInSampleOp;
    }

    @Override
    public SampleOpTest mapRow(ResultSet row, int i) throws SQLException
    {
        LabTestMetadata tmd =
            new LabTestMetadata(
            row.getLong(1),
            row.getLong(2),
            row.getLong(3),
            row.getLong(4),
            row.getString(5),
            row.getString(6),
            LabTestTypeCode.valueOf(row.getString(7)),
            row.getString(8),
            row.getString(9),
            row.getTimestamp(10).toInstant(),
            row.getString(11),
            row.getTimestamp(12).toInstant(),
            row.getString(13),
            row.getInt(14),
            Optional.ofNullable(row.getString(15)).map(LocalDate::parse),
            Optional.ofNullable(row.getString(16)),
            Optional.ofNullable(row.getString(17)),
            Optional.ofNullable(row.getTimestamp(18)).map(Timestamp::toInstant),
            Optional.ofNullable(row.getString(19)), // reviewed by emp
            Optional.ofNullable(row.getTimestamp(20)).map(Timestamp::toInstant),
            Optional.ofNullable(row.getString(21)) // saved to facts by emp
        );

        Optional<String> lid = Optional.ofNullable(row.getString(22));
        Optional<String> paf = Optional.ofNullable(row.getString(23));
        Optional<String> subject = Optional.ofNullable(row.getString(24));

        Optional<List<LabTestMetadata>> testMds =
            includeTestMetadataInSampleOp ? Optional.of(singletonList(tmd)) : Optional.empty();

        SampleOp s =
            new SampleOp(
                tmd.getOpId(),
                tmd.getSampleTrackingNumber(),
                tmd.getSampleTrackingSubNumber(),
                tmd.getPac(),
                lid,
                paf,
                tmd.getProductName(),
                Optional.empty(),
                Optional.empty(),
                Optional.empty(), // last refreshed from FACTS not available when sample metadata comes from test record
                subject,
                testMds,
                Optional.empty()  // assignments omitted
            );

        return new SampleOpTest(s, tmd);
    }
}
