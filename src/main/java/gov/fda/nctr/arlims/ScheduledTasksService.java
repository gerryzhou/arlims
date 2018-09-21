package gov.fda.nctr.arlims;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.data_access.ServiceBase;


@Service
public class ScheduledTasksService extends ServiceBase implements SchedulingConfigurer
{
    private int threadPoolSize;

    private FactsService factsService;

    public ScheduledTasksService
        (
            @Value("${scheduling.thread-pool-size:5}") int threadPoolSize,
            FactsService factsService
        )
    {
        this.threadPoolSize = threadPoolSize;
        this.factsService = factsService;
    }

    @Override
    public void configureTasks(ScheduledTaskRegistrar scheduledTaskRegistrar)
    {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();

        scheduler.setPoolSize(threadPoolSize);

        log.info("Reserving " + threadPoolSize + " threads for FACTS scheduling.");

        scheduler.setThreadNamePrefix("facts-scheduler-");

        scheduler.initialize();

        scheduledTaskRegistrar.setTaskScheduler(scheduler);
    }


    @Scheduled(cron = "${scheduling.facts-sample-refresh.cron}")
    public void refreshSamplesFromFacts()
    {

        log.info("[scheduled task start] Refreshing sample and employee assignment information from FACTS.");

        factsService.refreshSamplesFromFacts();

        log.info("[scheduled task end] Finished refreshing sample and employee assignment information from FACTS.");
    }
}
