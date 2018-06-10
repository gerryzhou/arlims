package gov.fda.nctr.arlims.models.db;

import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;


@Entity
//@Table(
//    uniqueConstraints = {
//        @UniqueConstraint(name="UN_SMPUNIT_SMPNUMPAC", columnNames = {"SAMPLE_NUM", "PAC_CODE"})
//    }
//)
public class SampleUnit
{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long sampleNum;

    @Size(max = 20) @NotBlank
    private String pacCode;

    @Size(max = 100)
    private String productName;

    private LocalDate received;

    @Size(max = 100)
    private String receivedBy;

    protected SampleUnit() {}

    public SampleUnit
        (
            @NotNull Long sampleNum,
            @Size(max = 20) @NotBlank String pacCode,
            @Size(max = 100) String productName,
            LocalDate received,
            @Size(max = 100) String receivedBy
        )
    {
        this.sampleNum = sampleNum;
        this.pacCode = pacCode;
        this.productName = productName;
        this.received = received;
        this.receivedBy = receivedBy;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Long getSampleNum() { return sampleNum; }

    public void setSampleNum(Long sampleNum) { this.sampleNum = sampleNum; }

    public String getPacCode() { return pacCode; }

    public void setPacCode(String pacCode) { this.pacCode = pacCode; }

    public String getProductName() { return productName; }

    public void setProductName(String productName) { this.productName = productName; }

    public LocalDate getReceived() { return received; }

    public void setReceived(LocalDate received) { this.received = received; }

    public String getReceivedBy() { return receivedBy; }

    public void setReceivedBy(String receivedBy) { this.receivedBy = receivedBy; }
}
