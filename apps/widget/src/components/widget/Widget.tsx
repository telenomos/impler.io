import { useCallback, useEffect, useState } from 'react';

import { Modal } from '@ui/Modal';
import { ParentWindow } from '@util';
import { TEXTS, variables } from '@config';
import { useWidget } from '@hooks/useWidget';
import { useAppState } from '@store/app.context';
import { Layout } from 'components/Common/Layout';
import { ConfirmModal } from './modals/ConfirmModal';
import { useTemplates } from '@hooks/useTemplates';
import { PhasesEnum, PromptModalTypesEnum } from '@types';
import { IImportConfig, IUpload, TemplateModeEnum } from '@impler/shared';
import { logAmplitudeEvent, resetAmplitude } from '@amplitude';

import { Phase0 } from './Phases/Phase0';
import { Phase01 } from './Phases/Phase0-1';
import { Phase1 } from './Phases/Phase1';
import { Phase2 } from './Phases/Phase2';
import { Phase3 } from './Phases/Phase3';
import { Phase4 } from './Phases/Phase4';
import { AutoImportPhase1 } from './Phases/AutoImportPhases/AutoImportPhase1';
import { AutoImportPhase2 } from './Phases/AutoImportPhases/AutoImportPhase2';
import { AutoImportPhase3 } from './Phases/AutoImportPhases/AutoImportPhase3';
import { AutoImportPhase4 } from './Phases/AutoImportPhases/AutoImportPhase4';

export function Widget() {
  const defaultDataCount = 0;
  const { hasImageUpload } = useTemplates();
  const { terminateUpload, phase, setPhase } = useWidget();
  const [dataCount, setDataCount] = useState<number>(defaultDataCount);
  const [promptContinueAction, setPromptContinueAction] = useState<PromptModalTypesEnum>();
  const {
    title,
    uploadInfo,
    showWidget,
    templateInfo,
    importConfig,
    setShowWidget,
    setImportConfig,
    reset: resetAppState,
  } = useAppState();

  const onUploadResetClick = () => {
    logAmplitudeEvent('RESET');
    setPromptContinueAction(PromptModalTypesEnum.UPLOAD_AGAIN);
  };
  const onPromptConfirm = () => {
    terminateUpload();
    setPromptContinueAction(undefined);
    if (uploadInfo._id) ParentWindow.UploadTerminated({ uploadId: uploadInfo._id });
    if (promptContinueAction === PromptModalTypesEnum.CLOSE) closeWidget();
  };
  const onPromptCancel = () => {
    setPromptContinueAction(undefined);
  };
  const onClose = () => {
    if ([PhasesEnum.VALIDATE, PhasesEnum.IMAGE_UPLOAD, PhasesEnum.UPLOAD, PhasesEnum.COMPLETE].includes(phase))
      closeWidget(true);
    else setPromptContinueAction(PromptModalTypesEnum.CLOSE);
  };
  const closeWidget = (resetPhase?: boolean) => {
    setShowWidget(false);
    resetAmplitude();
    resetAppState();
    if (resetPhase) setPhase(PhasesEnum.VALIDATE);
    setTimeout(() => {
      ParentWindow.Close();
    }, variables.closeDelayInMS);
  };
  const resetProgress = () => {
    resetAppState();
    setPhase(PhasesEnum.VALIDATE);
  };
  const onComplete = (uploadData: IUpload, importedData?: Record<string, any>[]) => {
    setDataCount(uploadData.totalRecords);
    setPhase(PhasesEnum.COMPLETE);
    ParentWindow.UploadCompleted(uploadData);
    if (importedData) ParentWindow.DataImported(importedData);
  };
  const onSuccess = useCallback(() => {
    setImportConfig((configData: IImportConfig) => {
      setPhase(
        configData.mode === TemplateModeEnum.AUTOMATIC
          ? PhasesEnum.CONFIGURE
          : hasImageUpload
          ? PhasesEnum.IMAGE_UPLOAD
          : PhasesEnum.UPLOAD
      );

      return configData;
    });
  }, [importConfig, hasImageUpload]);

  const PhaseView = {
    [PhasesEnum.VALIDATE]: <Phase0 onValidationSuccess={onSuccess} />,
    ...(importConfig.mode === TemplateModeEnum.AUTOMATIC
      ? {
          [PhasesEnum.CONFIGURE]: <AutoImportPhase1 onNextClick={() => setPhase(PhasesEnum.MAPCOLUMNS)} />,
          [PhasesEnum.MAPCOLUMNS]: <AutoImportPhase2 onNextClick={() => setPhase(PhasesEnum.SCHEDULE)} />,
          [PhasesEnum.SCHEDULE]: <AutoImportPhase3 onNextClick={() => setPhase(PhasesEnum.CONFIRM)} />,
          [PhasesEnum.CONFIRM]: <AutoImportPhase4 onCloseClick={onClose} />,
        }
      : {
          [PhasesEnum.IMAGE_UPLOAD]: <Phase01 goToUpload={() => setPhase(PhasesEnum.UPLOAD)} />,
          [PhasesEnum.UPLOAD]: (
            <Phase1
              hasImageUpload={hasImageUpload}
              onNextClick={() => setPhase(PhasesEnum.MAPPING)}
              generateImageTemplate={() => setPhase(PhasesEnum.IMAGE_UPLOAD)}
            />
          ),
          [PhasesEnum.MAPPING]: (
            <Phase2 onNextClick={() => setPhase(PhasesEnum.REVIEW)} onPrevClick={onUploadResetClick} />
          ),
          [PhasesEnum.REVIEW]: <Phase3 onNextClick={onComplete} onPrevClick={onUploadResetClick} />,
          [PhasesEnum.COMPLETE]: (
            <Phase4 rowsCount={dataCount} onUploadAgainClick={resetProgress} onCloseClick={onClose} />
          ),
        }),
  };

  const subTitle = {
    [PromptModalTypesEnum.CLOSE]: TEXTS.PROMPT.SUBTITLE_CLOSE,
    [PromptModalTypesEnum.UPLOAD_AGAIN]: TEXTS.PROMPT.SUBTITLE_RESET,
  };

  useEffect(() => {
    if (!showWidget) {
      setPhase(PhasesEnum.VALIDATE);
    }
  }, [showWidget]);

  return (
    <Modal title={title || importConfig?.title || templateInfo?.name} opened={showWidget} onClose={onClose}>
      <Layout
        active={phase}
        hasImageUpload={hasImageUpload}
        title={title || importConfig?.title || templateInfo?.name}
        mode={importConfig.mode as TemplateModeEnum}
      >
        {PhaseView[phase]}

        <ConfirmModal
          onCancel={onPromptCancel}
          title={TEXTS.PROMPT.TITLE}
          onConfirm={onPromptConfirm}
          cancelLabel={TEXTS.PROMPT.NO}
          confirmLabel={TEXTS.PROMPT.YES}
          opened={!!promptContinueAction}
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          subTitle={subTitle[promptContinueAction!]}
        />
      </Layout>
    </Modal>
  );
}
