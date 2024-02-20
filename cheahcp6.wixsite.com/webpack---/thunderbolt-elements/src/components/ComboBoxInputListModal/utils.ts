export const getComboBoxInputListModalId = (parentCompId: string) =>
  `listModal_${parentCompId}`;

const isVisible = function (
  optionEl: HTMLDivElement,
  container: HTMLDivElement,
) {
  const optionTop = optionEl.offsetTop;
  const optionBottom = optionTop + optionEl.getBoundingClientRect().height;
  const containerTop = container.scrollTop;
  const containerBottom = containerTop + container.offsetHeight;

  return optionTop >= containerTop && optionBottom <= containerBottom;
};

export const scrollDownToOption = ({
  optionEl,
  listEl,
}: {
  optionEl: HTMLDivElement | null;
  listEl: HTMLDivElement | null;
}) => {
  if (optionEl && listEl && !isVisible(optionEl, listEl)) {
    listEl.scrollTop =
      optionEl.offsetTop -
      listEl.offsetHeight +
      optionEl.getBoundingClientRect().height;
  }
};

export const scrollUpToOption = ({
  optionEl,
  listEl,
  hoveredOptionIndex,
}: {
  optionEl: HTMLDivElement | null;
  listEl: HTMLDivElement | null;
  hoveredOptionIndex: number;
}) => {
  if (optionEl && listEl && !isVisible(optionEl, listEl)) {
    listEl.scrollTop =
      optionEl.getBoundingClientRect().height * hoveredOptionIndex;
  }
};
